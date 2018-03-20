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
using System.Web.Http.Description;

namespace TVSM.API.Modules.OpenSOW
{
    /// <summary>
    /// Endpoints for OpenSOW module.
    /// </summary>
    [RoutePrefix("api/opensow")]
    public class OpenSOWController : ApiController
    {
        /// <summary>
        /// Get last updated date of database table.
        /// </summary>
        /// <param name="table">Table name</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>Array containing datetime</returns>
        [Route("~/api/lastupdated/{table}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetLastUpdated(string table, CancellationToken cancellationToken)
        {

            var fieldNames = new List<string>()
            {
                "Start",
                "tblTVSM",
                "AR",
                "SAT",
                "NCR",
                "tblReleasePerformance",
                "tblTest_Load",
                "Open SOW"
            };


            if (table == null || !fieldNames.Contains(table))
            {
                return BadRequest();
            }

            var fieldString = table + " Update";

            string queryString = string.Format(
                @"SELECT TOP 1 [{0}] FROM [tblDate_Update] WHERE [{0}] IS NOT NULL
                    ORDER BY [Today's Date] DESC", fieldString);

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {

                var result = await connection.QueryAsync<DateTime>(
                    new CommandDefinition(queryString, new { }, cancellationToken: cancellationToken)
                    );

                return Ok(result);
            }

        }

        /// <summary>
        /// Gets open statement of work on specified query.
        /// </summary>
        /// <param name="values">Javascript object consisting of field names, and array of allowable values for each field.</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <param name="skip">Optional criteria for paging</param>
        /// <param name="totals">Turns on or off aggregate query</param>
        /// <returns>If total is false, returns a paged list of values corresponding to query.  Otherwise, returns an object representing the aggregate.</returns>
        [Route("")]
        [HttpPost]
        public async Task<IHttpActionResult> GetOpenSOW(Dictionary<string, List<string>> values, CancellationToken cancellationToken, [FromUri] int skip = 0, [FromUri] bool totals = false)
        {
            var take = 100;
            int? next = skip + take;

            var fieldNames = new List<string>()
            {
                "ProgramX",
                "PST",
                "Tool"
            };


            if (values == null)
            {
                return BadRequest();
            }

            string queryString = string.Format(
                @"from tblOpen_SOW_Summary where 1=1");

            var dbArgs = new DynamicParameters();
            foreach (var item in values)
            {
                if (item.Value.Count > 0 && fieldNames.Contains(item.Key))
                {
                    string OsField;
                    switch (item.Key)
                    {
                        case "Program":
                            OsField = "ProgramX";
                            break;
                        case "Area":
                            OsField = "PST";
                            break;
                        case "Tool":
                            OsField = "LH_RH";
                            break;
                        default:
                            OsField = item.Key;
                            break;
                    }

                    queryString += string.Format(" and [{0}] in @{1}", OsField, item.Key);
                    dbArgs.Add(item.Key, item.Value);
                }
            }

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                IEnumerable<object> result;
                if (totals)
                {
                    queryString = @"select Sum([Hrs BTG MES]) as MES,
                (Sum([Qty AR])*8) as AR,
                (Sum([Qty SAT])*8) as SAT,
                (Sum([Qty NCR])*8) as NCR,
                 Count(*) as Qty "
                        + queryString;
                    result = await connection.QueryAsync(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                    );
                }
                else
                {
                    dbArgs.Add("skip", skip);
                    dbArgs.Add("take", take);
                    queryString = @"select LH_RH as Tool,
                ProgramX as Program,
                PST,
                [CCV COMM] as CCV_COMM,
                [CCV SAFETY] as CCV_SAFETY,
                [UNV MES] as UNV,
                [SFM MES] as SFM,
                [Hrs BTG MES] as Hrs_BTG_MES,
                [Qty AR] as AR,
                [Hrs BTG AR] as Hrs_BTG_AR,
                [Qty SAT] as SAT,
                [Hrs BTG SAT] as Hrs_BTG_SAT,
                [Qty NCR] as NCR,
                [Hrs BTG NCR] as Hrs_BTG_NCR " + queryString + " order by LH_RH OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";
                    result = await connection.QueryAsync<OpenSOWSummaryRow>(
                        new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                        );
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, result);
                response.Headers.Add("X-Next-Page", next.ToString());
                return ResponseMessage(response);
            }

        }

        /// <summary>
        /// Get open statment of work details for a single tool number.
        /// </summary>
        /// <param name="tool">Tool Number</param>
        /// <param name="program">Program value</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>Method returns an OpenSOWDetail object </returns>
        [Route("detail")]
        [HttpGet]
        [ResponseType(typeof(OpenSOWDetail))]
        public async Task<IHttpActionResult> GetOpenSOWDetail(string tool, string program, CancellationToken cancellationToken)
        {

            string queryString = string.Format(
                @"select [LH_RH] as tool,
                [Key Type] as Key_Type, [Key ID] as Key_ID,
                Program, PST, Detail, Unit, CCV, RC, Effectivity,
                [Plan Status] as Plan_Status,
                [Total Est] as Total_Est,
                [Sch Comp] as Sch_Comp,
                [Held for] as Held_for,
                Ramac, ECD, AssignedToName, AssignDate, UpdateDate, OrgPassedTo, Health,
                ProblemType, Rev, ACCP, Updated,
                [Queue ID] as Queue_ID,
                [Status Description] as Status_Description
                from tblOpen_SOW where [LH_RH] = @toolno");

            if (program != null)
            {
                queryString += " and Program = @program";
            }
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync<OpenSOWRow>(
                    new CommandDefinition(queryString, new { toolno = tool, program = program }, cancellationToken: cancellationToken)
                    );

                if (!result.Any())
                {
                    return NotFound();
                }

                var grouped = result.GroupBy(r => r.Tool).Select(x => new OpenSOWDetail
                {
                    Tool = x.Key,
                    Program = x.FirstOrDefault().Program,
                    PST = x.OrderBy(t => t.PST).FirstOrDefault().PST,
                    IsComm = x.Where(t => t.CCV == "COMMITTED" || t.CCV == "ENG CHG").Any(),
                    IsSafe = x.Where(t => t.CCV == "SAFETY").Any(),
                    UNV = x.Where(t => t.Plan_Status == "UNV"),
                    SFM = x.Where(t => t.Plan_Status == "SFM"),
                    AR = x.Where(t => t.Key_Type.Trim() == "AR"),
                    NCR = x.Where(t => t.Key_Type.Trim() == "NCR"),
                    SAT = x.Where(t => t.Key_Type.Trim() == "SAT")
                }).FirstOrDefault();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, grouped);
                //response.Headers.Add("X-Next-Page", next.ToString());
                return ResponseMessage(response);
            }

        }

        /// <summary>
        /// Get if any open SOW for tool.
        /// </summary>
        /// <param name="tool">Tool Number</param>
        /// <param name="program">Program value</param>
        /// <param name="cancellationToken">AJAX cancellation token</param>
        /// <returns>List of string</returns>
        [Route("detail/exists")]
        [HttpGet]
        public async Task<IHttpActionResult> GetOpenSOWDetailExists(string tool, CancellationToken cancellationToken)
        {

            string comparison;
            if (tool.Contains("*"))
            {
                comparison = "LIKE";
                tool = tool.Replace('*', '%');
            }
            else
            {
                comparison = "=";
            }

            string queryString = string.Format(
                @"select [LH_RH] as tool
                from tblOpen_SOW_Summary where [LH_RH] {0} @toolno", comparison);

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync<string>(
                    new CommandDefinition(queryString, new { toolno = tool}, cancellationToken: cancellationToken)
                    );

                return Ok(result);

            }

        }

        /// <summary>
        /// Get excel file from specified criteria.
        /// </summary>
        /// <param name="values">Javascript object consisting of filter values in an array.</param>
        /// <param name="cancellationToken">AJAX cancellation token.</param>
        /// <returns>Method returns an excel file.</returns>
        [Route("excel")]
        [HttpPost]
        public async Task<IHttpActionResult> GetOpenSOWExcel(OpenSOWExcelPost values, CancellationToken cancellationToken)
        {
            var dict = values.ToDictionary();

            if (values == null)
            {
                return null;
            }

            string queryString = string.Format(
                @"select [LH_RH] as Tool_Number,
                [Key Type] as Key_Type, [Key ID] as Key_ID,
                Program, PST, Detail, Unit, CCV, RC, Effectivity,
                [Plan Status] as Plan_Status,
                [Total Est] as Total_Est,
                [Sch Comp] as Sch_Comp,
                [Held for] as Held_for,
                Ramac as RAMAC, 
                ECD, AssignedToName, AssignDate, UpdateDate, OrgPassedTo, Health,
                ProblemType, Rev, ACCP, Updated,
                [Queue ID] as Queue_ID,
                [Status Description] as Status_Description from tblOpen_SOW where 1=1");

            var dbArgs = new DynamicParameters();
            foreach (var item in dict)
            {
                if (item.Value.Count > 0)
                {
                    string OsField;
                    switch (item.Key)
                    {
                        case "Program":
                            OsField = "Program";
                            break;
                        case "Area":
                            OsField = "PST";
                            break;
                        case "Tool":
                            OsField = "LH_RH";
                            break;
                        default:
                            OsField = item.Key;
                            break;
                    }
                    queryString += string.Format(" and [{0}] in @{1}", OsField, item.Key);
                    dbArgs.Add(item.Key, item.Value);
                }
            }

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var result = await connection.QueryAsync<OpenSOWExcelExport>(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                    );

                return new ExcelResult<OpenSOWExcelExport>(result.ToList(), "OpenSOW.xlsx");
            }

        }
    }
}
