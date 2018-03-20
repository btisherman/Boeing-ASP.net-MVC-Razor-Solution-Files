using Dapper;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using TVSM.API.Modules.Application.Helpers;
using TVSM.API.Modules.BCADashboard.Models;
using Teradata.Client.Provider;
using TVSM.Security;

namespace TVSM.API.Modules.BCADashboard
{
    [RoutePrefix("api/bcadashboard")]
    public class BCADashboardController : ApiController
    {

        /// <summary>
        /// Get order health values from tblTVSM to populate Schedule Health filter on client.
        /// </summary>
        /// <param name="values">Dictionary of filter selections</param>
        /// <param name="cancellationToken">AJAX cancellation token to permit cancellation of database call</param>
        /// <returns></returns>
        [Route("heldhealth")]
        [HttpPost]
        public async Task<IHttpActionResult> GetHFHealth(Dictionary<string, List<string>> values, CancellationToken cancellationToken)
        {
            var DbStructure = new DbStructure();
            var FieldInfo = DbStructure.ValidateTable("tvsm");

            string queryString = @"declare @todayMday int
SELECT @todayMday = mfg_day_5
  FROM [M_Day_Calendar] 
 WHERE convert(date, getdate()) = Calendar_Date

 select Responsibility, Health, Count(*) Qty from
 (SELECT
      [MDAYOnHold],
	  h.Responsibility
      ,[OrderID]
	  ,(@todayMDay - MDAYOnHold) ElapsedMday
	  ,Health =  
      CASE   
         WHEN (@todayMDay - MDAYOnHold) > 10 THEN 'Red'  
         WHEN (@todayMDay - MDAYOnHold) > 5 THEN 'Yellow'   
         ELSE 'Green'  
      END --,
	  --Responsibility
  FROM tblTVSM t
  inner join (SELECT o.orderid, o.operno, o.holdcode, o.mdayonhold
  FROM (
  select orderid, min(cast(operno as int)) as minoperno
  from TED_PROD.MES_SFM_OperationData 
  where status not in ('X', 'C')
  group by orderid
  ) as x inner join TED_PROD.MES_SFM_OperationData as o on 
  o.OrderID = x.OrderID and o.operno = x.minoperno) o
  on t.[Order ID] = o.OrderID
  left join hf_lookup h
  on o.holdcode = h.[OpStatus Codes]
  where 1=1";
            var dbArgs = new DynamicParameters();
            if (values != null)
            {
                foreach (var item in values)
                {
                    if (item.Value.Count > 0 && FieldInfo.Item2.Contains(item.Key))
                    {
                        var removeSpaces = item.Key.Replace(' ', '_');
                        string tablePrefix = item.Key == "Program" ? "t." : "";
                        queryString += string.Format(" and {2}[{0}] in @{1}", item.Key, removeSpaces, tablePrefix);
                        List<string> searchValues = item.Value;
                        if (item.Key == "Form Type")
                        {
                            searchValues = DbStructure.GetFormTypeValues(item.Value);
                        }
                        dbArgs.Add(removeSpaces, searchValues);
                    }
                }
            }

            queryString += @") h
  group by Responsibility, Health
  order by Responsibility, Health";
            IEnumerable<HFHealthQuery> res;
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                res = await connection.QueryAsync<HFHealthQuery>(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        /// <summary>
        /// Get PAR health.
        /// </summary>
        /// <param name="values">Dictionary of filter selections</param>
        /// <param name="cancellationToken">AJAX cancellation token to permit cancellation of database call</param>
        /// <returns></returns>
        [Route("arhealth")]
        [HttpPost]
        public async Task<IHttpActionResult> GetARHealth(Dictionary<string, List<string>> values, CancellationToken cancellationToken)
        {
            var DbStructure = new DbStructure();
            var FieldInfo = DbStructure.ValidateTable("tvsm");

            string queryString = @"select Health, Count(*) Qty from
 (SELECT
	   [Order ID]
	  ,a.[AR #]
	  ,convert(date, createdate) Created
	  ,DATEDIFF(d, convert(date, createdate),convert(date, getdate())) ElapsedDays
	  ,Health =  
      CASE   
         WHEN DATEDIFF(d, convert(date, createdate),convert(date, getdate())) > 10 THEN 'Red'  
         WHEN DATEDIFF(d, convert(date, createdate),convert(date, getdate())) > 3 THEN 'Yellow'   
         ELSE 'Green'  
      END 
  FROM tblAR a
  inner join tblTVSM t
  on t.[Order ID] = a.Ramac
  where 1=1";
            var dbArgs = new DynamicParameters();
            if (values != null)
            {
                foreach (var item in values)
                {
                    if (item.Value.Count > 0 && FieldInfo.Item2.Contains(item.Key))
                    {
                        var removeSpaces = item.Key.Replace(' ', '_');
                        string tablePrefix = item.Key == "Program" ? "t." : "";
                        queryString += string.Format(" and {2}[{0}] in @{1}", item.Key, removeSpaces, tablePrefix);
                        List<string> searchValues = item.Value;
                        if (item.Key == "Form Type")
                        {
                            searchValues = DbStructure.GetFormTypeValues(item.Value);
                        }
                        dbArgs.Add(removeSpaces, searchValues);
                    }
                }
            }

            queryString += @") h
  group by Health
  order by Health";
            IEnumerable<HFHealthQuery> res;
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                res = await connection.QueryAsync<HFHealthQuery>(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        /// <summary>
        /// Get NCR health.
        /// </summary>
        /// <param name="values">Dictionary of filter selections</param>
        /// <param name="cancellationToken">AJAX cancellation token to permit cancellation of database call</param>
        /// <returns></returns>
        [Route("ncrhealth")]
        [HttpPost]
        public async Task<IHttpActionResult> GetNCRHealth(Dictionary<string, List<string>> values, CancellationToken cancellationToken)
        {
            var DbStructure = new DbStructure();
            var FieldInfo = DbStructure.ValidateTable("tvsm");

            string queryString = @"select Health, Count(*) Qty from
 (SELECT
      t.[Order ID],
	  n.NCR
	  ,DATEDIFF(d, convert(date, created_date),convert(date, getdate())) ElapsedDays
	  ,Health =  
      CASE   
         WHEN DATEDIFF(d, convert(date, created_date),convert(date, getdate())) > 60 THEN 'Red'  
         WHEN DATEDIFF(d, convert(date, created_date),convert(date, getdate())) > 29 THEN 'Yellow'   
         ELSE 'Green'  
      END --,
	  --Responsibility
  FROM [dbo].[tblNCR_Order_ID] n
  inner join tblTVSM t
  on t.[Order ID] = n.[Order ID]
  where 1=1";
            var dbArgs = new DynamicParameters();
            if (values != null)
            {
                foreach (var item in values)
                {
                    if (item.Value.Count > 0 && FieldInfo.Item2.Contains(item.Key))
                    {
                        var removeSpaces = item.Key.Replace(' ', '_');
                        string tablePrefix = item.Key == "Program" ? "t." : "";
                        queryString += string.Format(" and {2}[{0}] in @{1}", item.Key, removeSpaces, tablePrefix);
                        List<string> searchValues = item.Value;
                        if (item.Key == "Form Type")
                        {
                            searchValues = DbStructure.GetFormTypeValues(item.Value);
                        }
                        dbArgs.Add(removeSpaces, searchValues);
                    }
                }
            }

            queryString += @") h
  group by Health
  order by Health";
            IEnumerable<HFHealthQuery> res;
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                res = await connection.QueryAsync<HFHealthQuery>(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        // Renton specific queries

        [Route("rtnschedulehealth/{area}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetHealthFromOrderss(string area, CancellationToken cancellationToken)
        {

            var areas = new Dictionary<string, string>();
            areas.Add("final", @"(workarea = 'KITTING' and workloc = 'AREA-9') or
	    (workarea = 'STAGING' and workloc = 'AREA-9') or
	    (workarea = 'R3741-09')");
            areas.Add("wings", @"(workarea = 'KITTING' and workloc = 'AREA-3') or
	    (workarea = 'STAGING' and workloc = 'AREA-3') or
	    (workarea = 'RW604-03')");
            areas.Add("backshop", @"(workarea = 'KITTING' and workloc = 'AREA-12') or (workarea = 'STAGING' and workloc = 'AREA-12') or (workarea = 'R3775-12' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-12' and workloc = 'RTQ') or (workarea = 'R3775-12' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-6') or (workarea = 'STAGING' and workloc = 'AREA-6') or (workarea = 'R3774-06' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-06' and workloc = 'RTQ') or (workarea = 'R3774-06' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-5') or (workarea = 'STAGING' and workloc = 'AREA-5') or (workarea = 'R3774-05' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-05' and workloc = 'RTQ') or (workarea = 'R3774-05' and workloc = 'CLOSE')");
            areas.Add("all", string.Format("({0} OR {1} OR {2}) AND PlanSubType != 'DETAIL'", areas["final"], areas["wings"], areas["backshop"]));

            //(workarea = 'KITTING' and workloc = 'AREA-12') or (workarea = 'STAGING' and workloc = 'AREA-12') or (workarea = 'R3775-12' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-12' and workloc = 'RTQ') or (workarea = 'R3775-12' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-06') or (workarea = 'STAGING' and workloc = 'AREA-06') or (workarea = 'R3775-06' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-06' and workloc = 'RTQ') or (workarea = 'R3775-06' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-05') or (workarea = 'STAGING' and workloc = 'AREA-05') or (workarea = 'R3775-05' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-05' and workloc = 'RTQ') or (workarea = 'R3775-05' and workloc = 'CLOSE')

            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string queryString = @"SELECT
	 sum(case when [datecompplan] < CAST(GETDATE() AS DATE) then 1 else 0 end) Red,
	 sum(case when [datecompplan] >= CAST(GETDATE() AS DATE) AND [datecompplan] <= DATEADD(day, 7, CAST(GETDATE() AS DATE)) then 1 else 0 end) Yellow,
	 sum(case when [datecompplan] > DATEADD(day, 7, CAST(GETDATE() AS DATE)) then 1 else 0 end) Green
  FROM TED_PROD.MES_SFM_ToolOrder t
  inner join (SELECT o.orderid, o.operno, o.holdcode, o.mdayonhold, o.workarea, o.workcenter, o.workloc
  FROM (
  select orderid, min(cast(operno as int)) as minoperno
  from TED_PROD.MES_SFM_OperationData 
  where status not in ('X', 'C')
  group by orderid
  ) as x inner join TED_PROD.MES_SFM_OperationData as o on 
  o.OrderID = x.OrderID and o.operno = x.minoperno) o
  on t.[OrderID] = o.OrderID
    where {0}";
     
  
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var res = await connection.QueryAsync(
                    new CommandDefinition(string.Format(queryString, whereString), new {}, cancellationToken: cancellationToken)
                   );

                return Ok(res.FirstOrDefault());
            }

        }

        [Route("rtnheldhealth/{area}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetHFHealth(string area, CancellationToken cancellationToken)
        {
            var areas = new Dictionary<string, string>();
            areas.Add("final", @"(workarea = 'KITTING' and workloc = 'AREA-9') or
	    (workarea = 'STAGING' and workloc = 'AREA-9') or
	    (workarea = 'R3741-09')");
            areas.Add("wings", @"(workarea = 'KITTING' and workloc = 'AREA-3') or
	    (workarea = 'STAGING' and workloc = 'AREA-3') or
	    (workarea = 'RW604-03')");
            areas.Add("backshop", @"(workarea = 'KITTING' and workloc = 'AREA-12') or (workarea = 'STAGING' and workloc = 'AREA-12') or (workarea = 'R3775-12' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-12' and workloc = 'RTQ') or (workarea = 'R3775-12' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-6') or (workarea = 'STAGING' and workloc = 'AREA-6') or (workarea = 'R3774-06' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-06' and workloc = 'RTQ') or (workarea = 'R3774-06' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-5') or (workarea = 'STAGING' and workloc = 'AREA-5') or (workarea = 'R3774-05' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-05' and workloc = 'RTQ') or (workarea = 'R3774-05' and workloc = 'CLOSE')"); 
            areas.Add("all", string.Format("({0} OR {1} OR {2}) AND PlanSubType != 'DETAIL'", areas["final"], areas["wings"], areas["backshop"]));

            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string queryString = @"declare @todayMday int
SELECT @todayMday = mfg_day_5
  FROM [M_Day_Calendar] 
 WHERE convert(date, getdate()) = Calendar_Date

 select Responsibility, Health, Count(*) Qty from
 (SELECT
      o.[MDAYOnHold],
	  h.Responsibility
      ,o.[OrderID]
	  ,(@todayMDay - o.MDAYOnHold) ElapsedMday
	  ,Health =  
      CASE   
         WHEN (@todayMDay - o.MDAYOnHold) > 10 THEN 'Red'  
         WHEN (@todayMDay - o.MDAYOnHold) > 5 THEN 'Yellow'   
         ELSE 'Green'  
      END --,
	  --Responsibility
  FROM TED_PROD.MES_SFM_ToolOrder t
  inner join (SELECT o.orderid, o.operno, o.holdcode, o.onhold, o.mdayonhold, o.workarea, o.workcenter, o.workloc
  FROM (
  select orderid, min(cast(operno as int)) as minoperno
  from TED_PROD.MES_SFM_OperationData 
  where status not in ('X', 'C')
  group by orderid
  ) as x inner join TED_PROD.MES_SFM_OperationData as o on 
  o.OrderID = x.OrderID and o.operno = x.minoperno) o
  on t.[OrderID] = o.OrderID
  left join hf_lookup h
  on o.holdcode = h.[OpStatus Codes]
  where (t.onhold = 1 or o.onhold = 1) and {0}) h
  group by Responsibility, Health
  order by Responsibility, Health";

            IEnumerable<HFHealthQuery> res;
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                res = await connection.QueryAsync<HFHealthQuery>(
                    new CommandDefinition(string.Format(queryString, whereString), new { }, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        [Route("rtnheldhealth/{area}/{responsible}/{health}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetHFHealthOrders(string area, string responsible, string health, CancellationToken cancellationToken)
        {
            var areas = new Dictionary<string, string>();
            areas.Add("final", @"(workarea = 'KITTING' and workloc = 'AREA-9') or
	    (workarea = 'STAGING' and workloc = 'AREA-9') or
	    (workarea = 'R3741-09')");
            areas.Add("wings", @"(workarea = 'KITTING' and workloc = 'AREA-3') or
	    (workarea = 'STAGING' and workloc = 'AREA-3') or
	    (workarea = 'RW604-03')");
            areas.Add("backshop", @"(workarea = 'KITTING' and workloc = 'AREA-12') or (workarea = 'STAGING' and workloc = 'AREA-12') or (workarea = 'R3775-12' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-12' and workloc = 'RTQ') or (workarea = 'R3775-12' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-6') or (workarea = 'STAGING' and workloc = 'AREA-6') or (workarea = 'R3774-06' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-06' and workloc = 'RTQ') or (workarea = 'R3774-06' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-5') or (workarea = 'STAGING' and workloc = 'AREA-5') or (workarea = 'R3774-05' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-05' and workloc = 'RTQ') or (workarea = 'R3774-05' and workloc = 'CLOSE')");
            areas.Add("all", string.Format("({0} OR {1} OR {2}) AND PlanSubType != 'DETAIL'", areas["final"], areas["wings"], areas["backshop"]));

            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            var responsibleParam = responsible == "None" ? "is null" : "= @responsible";
            string queryString = @"declare @todayMday int
SELECT @todayMday = mfg_day_5
  FROM [M_Day_Calendar] 
 WHERE convert(date, getdate()) = Calendar_Date

 select OrderId from
 (SELECT
      o.[MDAYOnHold],
	  h.Responsibility
      ,o.[OrderID]
	  ,(@todayMDay - o.MDAYOnHold) ElapsedMday
	  ,Health =  
      CASE   
         WHEN (@todayMDay - o.MDAYOnHold) > 10 THEN 'Red'  
         WHEN (@todayMDay - o.MDAYOnHold) > 5 THEN 'Yellow'   
         ELSE 'Green'  
      END
  FROM TED_PROD.MES_SFM_ToolOrder t
  inner join (SELECT o.orderid, o.operno, o.holdcode, o.onhold, o.mdayonhold, o.workarea, o.workcenter, o.workloc
  FROM (
  select orderid, min(cast(operno as int)) as minoperno
  from TED_PROD.MES_SFM_OperationData 
  where status not in ('X', 'C')
  group by orderid
  ) as x inner join TED_PROD.MES_SFM_OperationData as o on 
  o.OrderID = x.OrderID and o.operno = x.minoperno) o
  on t.[OrderID] = o.OrderID
  left join hf_lookup h
  on o.holdcode = h.[OpStatus Codes]
  where (t.onhold = 1 or o.onhold = 1) and {0}) h
  where Responsibility {1} and Health = @health";

            IEnumerable<string> res;
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                res = await connection.QueryAsync<string>(
                    new CommandDefinition(string.Format(queryString, whereString, responsibleParam), new { responsible = responsible, health = health }, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        [Route("rtnheldhealthsummary/{area}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetHeldHealthSummary(string area, CancellationToken cancellationToken)
        {

            var areas = new Dictionary<string, string>();
            areas.Add("final", @"(workarea = 'KITTING' and workloc = 'AREA-9') or
	    (workarea = 'STAGING' and workloc = 'AREA-9') or
	    (workarea = 'R3741-09')");
            areas.Add("wings", @"(workarea = 'KITTING' and workloc = 'AREA-3') or
	    (workarea = 'STAGING' and workloc = 'AREA-3') or
	    (workarea = 'RW604-03')");
            areas.Add("backshop", @"(workarea = 'KITTING' and workloc = 'AREA-12') or (workarea = 'STAGING' and workloc = 'AREA-12') or (workarea = 'R3775-12' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-12' and workloc = 'RTQ') or (workarea = 'R3775-12' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-6') or (workarea = 'STAGING' and workloc = 'AREA-6') or (workarea = 'R3774-06' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-06' and workloc = 'RTQ') or (workarea = 'R3774-06' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-5') or (workarea = 'STAGING' and workloc = 'AREA-5') or (workarea = 'R3774-05' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-05' and workloc = 'RTQ') or (workarea = 'R3774-05' and workloc = 'CLOSE')");
            areas.Add("all", string.Format("({0} OR {1} OR {2}) AND PlanSubType != 'DETAIL'", areas["final"], areas["wings"], areas["backshop"]));

            //(workarea = 'KITTING' and workloc = 'AREA-12') or (workarea = 'STAGING' and workloc = 'AREA-12') or (workarea = 'R3775-12' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-12' and workloc = 'RTQ') or (workarea = 'R3775-12' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-06') or (workarea = 'STAGING' and workloc = 'AREA-06') or (workarea = 'R3775-06' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-06' and workloc = 'RTQ') or (workarea = 'R3775-06' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-05') or (workarea = 'STAGING' and workloc = 'AREA-05') or (workarea = 'R3775-05' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-05' and workloc = 'RTQ') or (workarea = 'R3775-05' and workloc = 'CLOSE')

            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string queryString = @"SELECT
	 sum(case when [datecompplan] < CAST(GETDATE() AS DATE) then 1 else 0 end) Red,
	 sum(case when [datecompplan] >= CAST(GETDATE() AS DATE) AND [datecompplan] <= DATEADD(day, 7, CAST(GETDATE() AS DATE)) then 1 else 0 end) Yellow,
	 sum(case when [datecompplan] > DATEADD(day, 7, CAST(GETDATE() AS DATE)) then 1 else 0 end) Green
  FROM TED_PROD.MES_SFM_ToolOrder t
  inner join (SELECT o.orderid, o.operno, o.holdcode, o.onhold, o.mdayonhold, o.workarea, o.workcenter, o.workloc
  FROM (
  select orderid, min(cast(operno as int)) as minoperno
  from TED_PROD.MES_SFM_OperationData 
  where status not in ('X', 'C')
  group by orderid
  ) as x inner join TED_PROD.MES_SFM_OperationData as o on 
  o.OrderID = x.OrderID and o.operno = x.minoperno) o
  on t.[OrderID] = o.OrderID
    where (t.onhold = 1 or o.onhold = 1) and ({0})";


            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var res = await connection.QueryAsync(
                    new CommandDefinition(string.Format(queryString, whereString), new { }, cancellationToken: cancellationToken)
                   );

                return Ok(res.FirstOrDefault());
            }

        }

        [Route("rtnheldhealthsummaryorders/{area}/{health}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetHeldHealthSummaryOrders(string area, string health, CancellationToken cancellationToken)
        {

            var areas = new Dictionary<string, string>();
            areas.Add("final", @"(workarea = 'KITTING' and workloc = 'AREA-9') or
	    (workarea = 'STAGING' and workloc = 'AREA-9') or
	    (workarea = 'R3741-09')");
            areas.Add("wings", @"(workarea = 'KITTING' and workloc = 'AREA-3') or
	    (workarea = 'STAGING' and workloc = 'AREA-3') or
	    (workarea = 'RW604-03')");
            areas.Add("backshop", @"(workarea = 'KITTING' and workloc = 'AREA-12') or (workarea = 'STAGING' and workloc = 'AREA-12') or (workarea = 'R3775-12' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-12' and workloc = 'RTQ') or (workarea = 'R3775-12' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-6') or (workarea = 'STAGING' and workloc = 'AREA-6') or (workarea = 'R3774-06' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-06' and workloc = 'RTQ') or (workarea = 'R3774-06' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-5') or (workarea = 'STAGING' and workloc = 'AREA-5') or (workarea = 'R3774-05' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-05' and workloc = 'RTQ') or (workarea = 'R3774-05' and workloc = 'CLOSE')");
            areas.Add("all", string.Format("({0} OR {1} OR {2}) AND PlanSubType != 'DETAIL'", areas["final"], areas["wings"], areas["backshop"]));

            //(workarea = 'KITTING' and workloc = 'AREA-12') or (workarea = 'STAGING' and workloc = 'AREA-12') or (workarea = 'R3775-12' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-12' and workloc = 'RTQ') or (workarea = 'R3775-12' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-06') or (workarea = 'STAGING' and workloc = 'AREA-06') or (workarea = 'R3775-06' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-06' and workloc = 'RTQ') or (workarea = 'R3775-06' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-05') or (workarea = 'STAGING' and workloc = 'AREA-05') or (workarea = 'R3775-05' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-05' and workloc = 'RTQ') or (workarea = 'R3775-05' and workloc = 'CLOSE')

            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string queryString = @"SELECT o.orderid
  FROM TED_PROD.MES_SFM_ToolOrder t
  inner join (SELECT o.orderid, o.operno, o.holdcode, o.onhold, o.mdayonhold, o.workarea, o.workcenter, o.workloc
  FROM (
  select orderid, min(cast(operno as int)) as minoperno
  from TED_PROD.MES_SFM_OperationData 
  where status not in ('X', 'C')
  group by orderid
  ) as x inner join TED_PROD.MES_SFM_OperationData as o on 
  o.OrderID = x.OrderID and o.operno = x.minoperno) o
  on t.[OrderID] = o.OrderID
    where (t.onhold = 1 or o.onhold = 1) and ({0})";

            switch (health)
            {
                case "Red":
                    queryString += @" and [datecompplan] < CAST(GETDATE() AS DATE)";
                    break;
                case "Yellow":
                    queryString += @" and [datecompplan] >= CAST(GETDATE() AS DATE) AND [datecompplan] <= DATEADD(day, 7, CAST(GETDATE() AS DATE))";
                    break;
                case "Green":
                    queryString += @" and [datecompplan] > DATEADD(day, 7, CAST(GETDATE() AS DATE))";
                    break;
                default:
                    break;
            }


            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var res = await connection.QueryAsync<string>(
                    new CommandDefinition(string.Format(queryString, whereString), new { }, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }

        }


        [Route("rtnarhealth/{area}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetARHealth(string area, CancellationToken cancellationToken)
        {
            var areas = new Dictionary<string, string>();
            areas.Add("final", @"(assignedto_mgrname_one = 'Pasquan, James T'
                or assignedtoname = 'Pasquan, James T')");
            areas.Add("wings", @"(assignedto_mgrname_one = 'Hansen, Carl T'
                or assignedtoname = 'Hansen, Carl T')");
            areas.Add("backshop", @"(assignedto_mgrname_one = 'Noble, James F'
                or assignedtoname = 'Noble, James F')");
            areas.Add("all", string.Format("({0} OR {1} OR {2})", areas["final"], areas["wings"], areas["backshop"]));

            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string queryString = @"select Health, Count(*) Qty from
 (SELECT
	  id
	  ,convert(date, createdate) Created
	  ,DATEDIFF(d, convert(date, createdate),convert(date, getdate())) ElapsedDays
	  ,Health =  
      CASE   
         WHEN DATEDIFF(d, convert(date, createdate),convert(date, getdate())) > 8 THEN 'Red'  
         WHEN DATEDIFF(d, convert(date, createdate),convert(date, getdate())) > 5 THEN 'Yellow'   
         ELSE 'Green'  
      END 
  FROM [TED_PROD].[arRequest_VR]
  where statuscode != 02
  and {0}
) h
  group by Health
  order by Health";
            IEnumerable<HFHealthQuery> res;
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                res = await connection.QueryAsync<HFHealthQuery>(
                    new CommandDefinition(string.Format(queryString, whereString), new { }, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        [Route("rtnarhealth/{area}/{health}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetARFromHealth(string area, string health, CancellationToken cancellationToken)
        {
            var areas = new Dictionary<string, string>();
            areas.Add("final", @"(assignedto_mgrname_one = 'Pasquan, James T'
                or assignedtoname = 'Pasquan, James T')");
            areas.Add("wings", @"(assignedto_mgrname_one = 'Hansen, Carl T'
                or assignedtoname = 'Hansen, Carl T')");
            areas.Add("backshop", @"(assignedto_mgrname_one = 'Noble, James F'
                or assignedtoname = 'Noble, James F')");
            areas.Add("all", string.Format("({0} OR {1} OR {2})", areas["final"], areas["wings"], areas["backshop"]));

            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string queryString = @"select * from
 (SELECT
	  id
	  ,convert(date, createdate) Created
	  ,DATEDIFF(d, convert(date, createdate),convert(date, getdate())) ElapsedDays
	  ,Health =  
      CASE   
         WHEN DATEDIFF(d, convert(date, createdate),convert(date, getdate())) > 8 THEN 'Red'  
         WHEN DATEDIFF(d, convert(date, createdate),convert(date, getdate())) > 5 THEN 'Yellow'   
         ELSE 'Green'  
      END 
  FROM [TED_PROD].[arRequest_VR]
  where statuscode != 02
  and {0}
) h where Health = @health";
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var res = await connection.QueryAsync(
                    new CommandDefinition(string.Format(queryString, whereString), new {health = health }, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        [Route("rtnncohealth/{area}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetNCOHealth(string area, CancellationToken cancellationToken)
        {
            var areas = new Dictionary<string, string>();
            areas.Add("final", "Q_ID = ''''142001-9TF''''");
            areas.Add("wings", "Q_ID = ''''142001-3''''");
            areas.Add("backshop", "Q_ID = ''''142001-5''''");
            areas.Add("all", string.Format("({0} OR {1} OR {2})", areas["final"], areas["wings"], areas["backshop"]));

            string query = @"Select * from OPENQUERY( PECORE_DEV, 'Select * from OPENQUERY(NCM_PROD, ''
Select Health, Count(*) Qty from (
SELECT 
CASE   
         WHEN (CAST(SCH_ENQ_TS as DATE) - CURRENT_DATE) < -30 THEN ''''Red''''  
         WHEN (CAST(SCH_ENQ_TS as DATE) - CURRENT_DATE)  < -20 THEN ''''Yellow''''   
         ELSE ''''Green''''  
      END Health,
      (CAST(SCH_ENQ_TS as DATE) - CURRENT_DATE) Elapsed,
      o.*
FROM OWI_STG_INQ_VW.OWI_ORDER_LATEST_REV o where order_type_cd = ''''NCO'''' 
and order_status = ''''Enqueued''''
and Q_LOG_CO_CD = ''''142'''' and {0}
) h group by health
'')' )";
            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string queryWithWhere = string.Format(query, whereString);
            IEnumerable<HFHealthQuery> res;
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                connection.Open();
                res = await connection.QueryAsync<HFHealthQuery>(
                    new CommandDefinition(queryWithWhere, new { }, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        [Route("rtnncohealth/{area}/{health}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetNCOHealth(string area, string health, CancellationToken cancellationToken)
        {
            var areas = new Dictionary<string, string>();
            areas.Add("final", "Q_ID = ''''142001-9TF''''");
            areas.Add("wings", "Q_ID = ''''142001-3''''");
            areas.Add("backshop", "Q_ID = ''''142001-5''''");
            areas.Add("all", string.Format("({0} OR {1} OR {2})", areas["final"], areas["wings"], areas["backshop"]));

            var healthOptions = new List<string>{"Red", "Yellow", "Green"};
            if (!healthOptions.Contains(health))
            {
                return BadRequest("Health was not an expected value");
            }

            string query = @"Select * from OPENQUERY( PECORE_DEV, 'Select * from OPENQUERY(NCM_PROD, ''
Select ORDER_KEY as KeyId, ORDER_ID as Id, Health, Elapsed as Aged, PLAN_TITLE, ASSIGNED_TO_NM from (
SELECT 
CASE   
         WHEN (CAST(SCH_ENQ_TS as DATE) - CURRENT_DATE) < -30 THEN ''''Red''''  
         WHEN (CAST(SCH_ENQ_TS as DATE) - CURRENT_DATE)  < -20 THEN ''''Yellow''''   
         ELSE ''''Green''''  
      END Health,
      (CAST(SCH_ENQ_TS as DATE) - CURRENT_DATE) Elapsed,
      o.*
FROM OWI_STG_INQ_VW.OWI_ORDER_LATEST_REV o where order_type_cd = ''''NCO'''' 
and order_status = ''''Enqueued''''
and Q_LOG_CO_CD = ''''142'''' and {0}
) h where Health = ''''{1}''''
'')' )";
            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string queryWithWhere = string.Format(query, whereString, health);
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                connection.Open();
                var res = await connection.QueryAsync(
                    new CommandDefinition(queryWithWhere, new { }, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        [Route("rtntipshealth/{area}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetTIPSHealth(string area, CancellationToken cancellationToken)
        {
            var areas = new Dictionary<string, string>();
            areas.Add("final", "[ToolConstOrg] = '3741'");
            areas.Add("wings", "[ToolConstOrg] = 'W604'");
            areas.Add("backshop", "[ToolConstOrg] = '3774'");
            areas.Add("all", string.Format("({0} OR {1} OR {2})", areas["final"], areas["wings"], areas["backshop"]));

            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string query = @"select Health, Count(*) Qty from
 (
SELECT
	  u.[PMDoc_ID]
	  ,'T2' as [Type]
	  ,[ToolConstOrg] as Area
	  ,[Type2NextTPMDt] Due
	  ,DATEDIFF(d, [Type2NextTPMDt],convert(date, getdate())) ElapsedDays
	  ,Health =  
      CASE   
         WHEN DATEDIFF(d, convert(date, getdate()), [Type2NextTPMDt]) < 0 THEN 'Red'  --Past
         WHEN EOMONTH(getdate()) >= Type2NextTPMDt THEN 'Yellow'
         WHEN EOMONTH(DATEADD(m, 1, getdate())) >= Type2NextTPMDt THEN 'Green'
      END 
  FROM PMDoc_Unit u
  inner join dbo.PMDoc p ON p.PMDoc_ID = u.PMDoc_ID
  --Get max record in the case there are multiple rows with the same PMDoc ID and Unit number
  inner join (select PMDoc_ID, UnitNo, MAX(PMDoc_Unit_Id) UID from PMDoc_Unit
  group by PMDoc_ID, UnitNo) d
  on u.PMDoc_Unit_Id = d.UID
  where [Type2NextTPMDt] is not null
  and EOMONTH(DATEADD(m, 1, getdate())) >= Type2NextTPMDt
  and p.DocStatus = 'R'
  and ToolEnggOrg = 'JTEV' and {0}
union all
SELECT
	  u.[PMDoc_ID]
	  ,'T3' as [Type]
	  ,[ToolConstOrg] as Area
	  ,[Type3NextTPMDt] Due
	  ,DATEDIFF(d, [Type3NextTPMDt],convert(date, getdate())) ElapsedDays
	  ,Health =  
      CASE   
         WHEN DATEDIFF(d, convert(date, getdate()), [Type3NextTPMDt]) < 0 THEN 'Red'  --Past
         WHEN EOMONTH(getdate()) >= Type3NextTPMDt THEN 'Yellow'
         WHEN EOMONTH(DATEADD(m, 1, getdate())) >= Type3NextTPMDt THEN 'Green'
      END 
  FROM PMDoc_Unit u
  inner join dbo.PMDoc p ON p.PMDoc_ID = u.PMDoc_ID
  --Get max record in the case there are multiple rows with the same PMDoc ID and Unit number
  inner join (select PMDoc_ID, UnitNo, MAX(PMDoc_Unit_Id) UID from PMDoc_Unit
  group by PMDoc_ID, UnitNo) d
  on u.PMDoc_Unit_Id = d.UID
  where [Type3NextTPMDt] is not null
  and EOMONTH(DATEADD(m, 1, getdate())) >= Type3NextTPMDt
  and p.DocStatus = 'R'
  and ToolEnggOrg = 'JTEV' and {0}
  ) a group by health";


            string queryString = string.Format(query, whereString);
            IEnumerable<HFHealthQuery> res;
            using (IDbConnection connection = new DBConnection().OpenConnection("tips"))
            {
                res = await connection.QueryAsync<HFHealthQuery>(
                    new CommandDefinition(queryString, new { }, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        [Route("rtntipshealth/{area}/{health}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetTIPSHealth(string area, string health, CancellationToken cancellationToken)
        {
            var areas = new Dictionary<string, string>();
            areas.Add("final", "[ToolConstOrg] = '3741'");
            areas.Add("wings", "[ToolConstOrg] = 'W604'");
            areas.Add("backshop", "[ToolConstOrg] = '3774'");
            areas.Add("all", string.Format("({0} OR {1} OR {2})", areas["final"], areas["wings"], areas["backshop"]));

            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string query = @"select PMDoc_ID as Id, [Type], Due, Health, ToolType, ToolNumber, UnitNo from
 (
SELECT
	  u.[PMDoc_ID]
	  ,'T2' as [Type]
	  ,[ToolConstOrg] as Area
	  ,[Type2NextTPMDt] Due
	  ,DATEDIFF(d, [Type2NextTPMDt],convert(date, getdate())) ElapsedDays
	  ,Health =  
      CASE   
         WHEN DATEDIFF(d, convert(date, getdate()), [Type2NextTPMDt]) < 0 THEN 'Red'  --Past
         WHEN EOMONTH(getdate()) >= Type2NextTPMDt THEN 'Yellow'
         WHEN EOMONTH(DATEADD(m, 1, getdate())) >= Type2NextTPMDt THEN 'Green'
      END 
     ,ToolType
    ,ToolNumber
    ,u.UnitNo
  FROM PMDoc_Unit u
  inner join dbo.PMDoc p ON p.PMDoc_ID = u.PMDoc_ID
  --Get max record in the case there are multiple rows with the same PMDoc ID and Unit number
  inner join (select PMDoc_ID, UnitNo, MAX(PMDoc_Unit_Id) UID from PMDoc_Unit
  group by PMDoc_ID, UnitNo) d
  on u.PMDoc_Unit_Id = d.UID
  where [Type2NextTPMDt] is not null
  and EOMONTH(DATEADD(m, 1, getdate())) >= Type2NextTPMDt
  and p.DocStatus = 'R'
  and ToolEnggOrg = 'JTEV' and {0}
union all
SELECT
	  u.[PMDoc_ID]
	  ,'T3' as [Type]
	  ,[ToolConstOrg] as Area
	  ,[Type3NextTPMDt] Due
	  ,DATEDIFF(d, [Type3NextTPMDt],convert(date, getdate())) ElapsedDays
	  ,Health =  
      CASE   
         WHEN DATEDIFF(d, convert(date, getdate()), [Type3NextTPMDt]) < 0 THEN 'Red'  --Past
         WHEN EOMONTH(getdate()) >= Type3NextTPMDt THEN 'Yellow'
         WHEN EOMONTH(DATEADD(m, 1, getdate())) >= Type3NextTPMDt THEN 'Green'
      END 
     ,ToolType
    ,ToolNumber
    ,u.UnitNo
  FROM PMDoc_Unit u
  inner join dbo.PMDoc p ON p.PMDoc_ID = u.PMDoc_ID
  --Get max record in the case there are multiple rows with the same PMDoc ID and Unit number
  inner join (select PMDoc_ID, UnitNo, MAX(PMDoc_Unit_Id) UID from PMDoc_Unit
  group by PMDoc_ID, UnitNo) d
  on u.PMDoc_Unit_Id = d.UID
  where [Type3NextTPMDt] is not null
  and EOMONTH(DATEADD(m, 1, getdate())) >= Type3NextTPMDt
  and p.DocStatus = 'R'
  and ToolEnggOrg = 'JTEV' and {0}
  ) h where Health = @health";


            string queryString = string.Format(query, whereString);
            using (IDbConnection connection = new DBConnection().OpenConnection("tips"))
            {
                var res = await connection.QueryAsync(
                    new CommandDefinition(queryString, new {health = health }, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

        [Route("rtnordersfromhealth/{area}/{health}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetOrdersFromHealth(string area, string health, CancellationToken cancellationToken)
        {
            var areas = new Dictionary<string, string>();
            areas.Add("final", @"(workarea = 'KITTING' and workloc = 'AREA-9') or
	    (workarea = 'STAGING' and workloc = 'AREA-9') or
	    (workarea = 'R3741-09')");
            areas.Add("wings", @"(workarea = 'KITTING' and workloc = 'AREA-3') or
	    (workarea = 'STAGING' and workloc = 'AREA-3') or
	    (workarea = 'RW604-03')");
            areas.Add("backshop", @"(workarea = 'KITTING' and workloc = 'AREA-12') or (workarea = 'STAGING' and workloc = 'AREA-12') or (workarea = 'R3775-12' and workloc = 'TOOL-SHOP') or (workarea = 'R3775-12' and workloc = 'RTQ') or (workarea = 'R3775-12' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-6') or (workarea = 'STAGING' and workloc = 'AREA-6') or (workarea = 'R3774-06' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-06' and workloc = 'RTQ') or (workarea = 'R3774-06' and workloc = 'CLOSE') or (workarea = 'KITTING' and workloc = 'AREA-5') or (workarea = 'STAGING' and workloc = 'AREA-5') or (workarea = 'R3774-05' and workloc = 'TOOL-SHOP') or (workarea = 'R3774-05' and workloc = 'RTQ') or (workarea = 'R3774-05' and workloc = 'CLOSE')");
            areas.Add("all", string.Format("({0} OR {1} OR {2}) AND PlanSubType != 'DETAIL'", areas["final"], areas["wings"], areas["backshop"]));

            string whereString;
            areas.TryGetValue(area, out whereString);
            if (whereString == null)
            {
                areas.TryGetValue("all", out whereString);
            }

            string queryString = @"SELECT o.orderid
  FROM TED_PROD.MES_SFM_ToolOrder t
  inner join (SELECT o.orderid, o.operno, o.holdcode, o.mdayonhold, o.workarea, o.workcenter, o.workloc
  FROM (
  select orderid, min(cast(operno as int)) as minoperno
  from TED_PROD.MES_SFM_OperationData 
  where status not in ('X', 'C')
  group by orderid
  ) as x inner join TED_PROD.MES_SFM_OperationData as o on 
  o.OrderID = x.OrderID and o.operno = x.minoperno) o
  on t.[OrderID] = o.OrderID
    where ({0}) ";

            switch (health)
            {
                case "Red":
                    queryString += @" and [datecompplan] < CAST(GETDATE() AS DATE)";
	                break;
                case "Yellow":
                    queryString += @" and [datecompplan] >= CAST(GETDATE() AS DATE) AND [datecompplan] <= DATEADD(day, 7, CAST(GETDATE() AS DATE))";
	                break;
                case "Green":
                    queryString += @" and [datecompplan] > DATEADD(day, 7, CAST(GETDATE() AS DATE))";
                    break;
                default:
                    break;
            }


            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var res = await connection.QueryAsync<string>(
                    new CommandDefinition(string.Format(queryString, whereString), new { }, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }

        }
    }
}
