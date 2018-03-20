using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using TVSM.API.Modules.Application.Helpers;
using Dapper;
using System.Collections.Specialized;

namespace TVSM.API.Modules.WIP
{
    /// <summary>
    /// Endpoints for WIP Board Module.
    /// </summary>
    [RoutePrefix("api/wip")]
    public class WIPController : ApiController
    {

        [Route("")]
        [HttpPost]
        public async Task<IHttpActionResult> GetWip(Dictionary<string, List<string>> values, CancellationToken cancellationToken, [FromUri] int skip = 0)
        {
            var take = 100;
            int? next = skip + take;

            var DbStructure = new DbStructure();
            var FieldInfo = DbStructure.ValidateTable("tvsm");

            if (values == null)
            {
                return BadRequest();
            }

            string queryString = string.Format(
            //@"with tempresult as( select * from tblTVSM where 1=1");
            @"with tempresult as(select top 1000 
 case
   when t.[Plan Status] = 'UNV' and t.[Form Type] != 'DESIGN' then dbo.FabGetPriority(IIF(Design.[Order ID] is not null, 1, 0), ISNULL(design.[ETVS %], 0), t.[Tool Type])
   when t.[Plan Status] = 'UNV' and t.[Form Type] = 'DESIGN'  then dbo.GetPriority(Flow, c.ReasonCode, c.[ToolCode], c.TotEstmHrs, t.[Tool Type])
  
   -- when some unrelated condition...
  else 0
 end
 as [Priority], t.* 
from tblTVSM t

inner join (SELECT o.*, o.Days_In_Signoff as Flow
  FROM (
  select orderid, max(sequence_number) as maxsequence
  from TED_PROD.MES_CAPP_ToolOrder_InSignOff 
  where current_work is not null
  group by orderid
  ) as x inner join TED_PROD.MES_CAPP_ToolOrder_InSignOff as o on 
  o.OrderID = x.OrderID and o.sequence_number = x.maxsequence) o
  on t.[Order ID] = o.OrderID


inner join TED_PROD.MES_CAPP_ToolOrder c
  on c.OrderID = t.[Order ID]

left join tblTVSM
  as Design
  on c.DesignLink = Design.[Order ID]

where 1=1"
);



            var dbArgs = new DynamicParameters();
            foreach (var item in values)
            {
                if (item.Key == "Order Start Status")
                {
                    queryString += " and t.[Plan Status] in ('SFM', 'UNV')";
                }
                if (item.Value.Count > 0 && FieldInfo.Item2.Contains(item.Key))
                {
                    var key = item.Key;
                    var removeSpaces = key.Replace(' ', '_');
                    queryString += string.Format(" and t.[{0}] in @{1}", key, removeSpaces);
                    List<string> searchValues = item.Value;
                    if (key == "Form Type")
                    {
                        searchValues = DbStructure.GetFormTypeValues(item.Value);
                    }
                    dbArgs.Add(removeSpaces, searchValues);
                }
            }

            dbArgs.Add("skip", skip);
            dbArgs.Add("take", take);

            queryString += "), tempcount as(select count(*) as maxrows from tempresult) select * from tempresult, tempcount";
            queryString = queryString + " order by [Priority], [Scheduled Complete]  OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";
           

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                IEnumerable<object> result;
                result = await connection.QueryAsync(
                        new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                        );
                bool DisplayNext = false;
                var obj = result.FirstOrDefault();
                if (obj != null)
                {
                    var dict = (IDictionary<string, object>)obj;
                    var maxrows = (int)dict["maxrows"];
                    if (maxrows > next)
                    {
                        DisplayNext = true;
                    }

                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, result);
                if (DisplayNext)
                {
                    response.Headers.Add("X-Next-Page", next.ToString());
                }
                return ResponseMessage(response);
            }

        }


        /// <summary>
        /// Get excel file from specified criteria.
        /// </summary>
        /// <param name="post">Object containing a string of comma-separated order IDs</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>Method returns an excel file from top 10000 rows.</returns>
        [Route("excel")]
        [HttpPost]
        public async Task<IHttpActionResult> GetToolsFromOrders(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var values = new Dictionary<string, List<string>>();
            NameValueCollection formData = await request.Content.ReadAsFormDataAsync();
            foreach (string key in formData)
            {
                values.Add(key, formData[key].Split(',').ToList());
            }

            var DbStructure = new DbStructure();
            var FieldInfo = DbStructure.ValidateTable("tvsm");

            if (!values.Any())
            {
                return BadRequest();
            }

            string queryString = string.Format(
               @"select TOP 10000 [Order ID] AS Order_ID,
                        [Tool Number] AS Tool_Number, 
                        [Tool Type] AS Tool_Type, 
                        Program, Area, ACCP, PDR, Stress, CDR, FDR, Chk,
                        TotalEst, Supplier, Designer, TIM, Checker, Releaser,
                        Sch_PDR, Sch_CDR, Sch_FDR, Sch_Chk, Sch_CMA, 
                        [Scheduled Start] AS Scheduled_Start,
                        [Actual Start] AS Actual_Start, 
                        [Released to CMA] AS Released_to_CMA, 
                        [Actual Est] AS Actual_Est, 
                        [ETVS %] AS ETVS_percent, 
                        [Scheduled Complete] AS Scheduled_Complete,
                        [Supplier ECD] AS Supplier_ECD,
                        [Active Work Area] AS Active_Work_Area,
                        [Held For] AS Held_For,
                        [ETVS Notes] AS ETVS_Notes
                        
                 from tblTVSM where 1=1");

            var dbArgs = new DynamicParameters();
            foreach (var item in values)
            {
                if (item.Value.Any() && FieldInfo.Item2.Contains(item.Key))
                {
                    var removeSpaces = item.Key.Replace(' ', '_');
                    queryString += string.Format(" and [{0}] in @{1}", item.Key, removeSpaces);
                    List<string> searchValues = item.Value;
                    if (item.Key == "Form Type")
                    {
                        searchValues = DbStructure.GetFormTypeValues(item.Value);
                    }
                    dbArgs.Add(removeSpaces, searchValues);
                }
            }

            queryString += " order by [Scheduled Complete]";

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync<tvsm_excel>(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                    );
                return new ExcelResult<tvsm_excel>(result.ToList(), "Wip.xlsx");
            }

        }

        /// <summary>
        /// Get wip board details from the specified order ID.
        /// </summary>
        /// <param name="id">Tool Order ID</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>Method returns a single row from tblTVSM.</returns>
        [Route("{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetToolFromOrder(string id, CancellationToken cancellationToken)
        {

            string queryString = string.Format("select * from tblTVSM where [Order ID] = @orderid");
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync(
                    new CommandDefinition(queryString, new { orderid = id }, cancellationToken: cancellationToken)
                    );
                var response = result.FirstOrDefault();
                if (response == null)
                {
                    return NotFound();
                }
                return Ok(response);
            }

        }

        /// <summary>
        /// Get if specific ID exists.
        /// </summary>
        /// <param name="id">Tool Order ID</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>List of string</returns>
        [Route("exists")]
        [HttpGet]
        public async Task<IHttpActionResult> GetToolExists(string id, CancellationToken cancellationToken)
        {
            string comparison;
            if(id.Contains("*")){
                comparison = "LIKE";
                id = id.Replace('*', '%');
            }else{
                comparison = "=";
            }
            string queryString = string.Format("select [Order ID] from tblTVSM where [Order ID] {0} @orderid", comparison);
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync<string>(
                    new CommandDefinition(queryString, new { orderid = id }, cancellationToken: cancellationToken)
                    );
                return Ok(result);
            }

        }

        /// <summary>
        /// Get all related ARs from specified order ID.
        /// </summary>
        /// <param name="id">Tool Order ID</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>List of AR rows</returns>
        [Route("~/api/arlog/{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetARlogFromOrder(string id, CancellationToken cancellationToken)
        {

            string queryString = string.Format("select * from tblAR where [RAMAC] = @orderid");
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync(
                    new CommandDefinition(queryString, new { orderid = id }, cancellationToken: cancellationToken)
                    );
                return Ok(result);
            }

        }

        /// <summary>
        /// Get all related MES Orders from specified order ID.
        /// </summary>
        /// <param name="id">Tool Order ID</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>List of MES order rows</returns>
        [Route("~/api/mesorders/{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetMesOrdersFromOrder(string id, CancellationToken cancellationToken)
        {

            string queryString = string.Format("select [Order ID], [Unit], [Effectivity], [TotalEst], [Scheduled Start], [Scheduled Complete], [Plan Status] from tblTVSM where [Design Link] = @orderid union select [Order ID], [Unit], [Effectivity], [TotalEst], [Scheduled Start], [Scheduled Complete], [Plan Status] from tblTVSM where [Related Order] = @orderid");
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync(
                    new CommandDefinition(queryString, new { orderid = id }, cancellationToken: cancellationToken)
                    );
                return Ok(result);
            }

        }

        /// <summary>
        /// Get all related MES Operations from specified order ID.
        /// </summary>
        /// <param name="id">Tool Order ID</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>List of MES operations</returns>
        [Route("~/api/orderops/{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetOpsFromOrder(string id, CancellationToken cancellationToken)
        {

            string queryString = string.Format("select * from tblSFM_Oper where [Order ID] = @orderid");
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync(
                    new CommandDefinition(queryString, new { orderid = id }, cancellationToken: cancellationToken)
                    );
                return Ok(result);
            }

        }

        /// <summary>
        /// Get all related SATs from specified order ID.
        /// </summary>
        /// <param name="id">Tool Order ID</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>List of SAT rows</returns>
        [Route("~/api/ordersats/{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetSatsFromOrder(string id, CancellationToken cancellationToken)
        {

            string queryString = string.Format("select * from tblSAT_Order_ID where [Order ID] = @orderid");
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync(
                    new CommandDefinition(queryString, new { orderid = id }, cancellationToken: cancellationToken)
                    );
                return Ok(result);
            }

        }

        /// <summary>
        /// Get all related NCRs from specified order ID.
        /// </summary>
        /// <param name="id">Tool Order ID</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>List of NCR rows</returns>
        [Route("~/api/orderncrs/{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetNcrsFromOrder(string id, CancellationToken cancellationToken)
        {

            string queryString = string.Format("select * from tblNCR_Order_ID where [Order ID] = @orderid");
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync(
                    new CommandDefinition(queryString, new { orderid = id }, cancellationToken: cancellationToken)
                    );
                return Ok(result);
            }

        }
    }
}
