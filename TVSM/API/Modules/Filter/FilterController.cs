using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using Dapper;
using System.Net.Http;
using System.Net;
using TVSM.API.Modules.Application.Helpers;
using System.Collections.Generic;
using TVSM.API.Modules.Filter.Models;
using System.Linq;

namespace TVSM.API.Modules.Filter
{
    /// <summary>
    /// Endpoints for queries using filter module.
    /// </summary>
    [RoutePrefix("api")]
    public class FilterController : ApiController
    {
        /// <summary>
        /// Get distinct "Responsible" field values that meet the criteria.
        /// </summary>
        /// <param name="values">Query criteria in the form of a javascript object.  Each database field is a property, and each property contains an array of strings.</param>
        /// <param name="cancellationToken">AJAX cancellation token to permit cancellation of database call</param>
        /// <returns>Method returns a list of strings</returns>
        [Route("fields/tvsm/Responsible")]
        [HttpPost]
        public async Task<IEnumerable<string>> GetResponsible(Dictionary<string, List<string>> values, CancellationToken cancellationToken)
        {
            var field = "Responsible";
            var DbStructure = new DbStructure();
            var FieldInfo = DbStructure.ValidateField("tvsm", field);

            if (FieldInfo == null)
            {
                return null;
            }
            string queryString = string.Format("with z as (select Designer, TIM, Checker, Releaser from tblTVSM where 1=1", field);
            var dbArgs = new DynamicParameters();
            if (values != null)
            {
                foreach (var item in values)
                {
                    if (item.Value.Count > 0 && FieldInfo.Item2.Contains(item.Key))
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
            }
            queryString += ") select Designer from z union select TIM from z union select Checker from z union select Releaser from z";

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                return await connection.QueryAsync<string>(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                   );
            }
        }

        /// <summary>
        /// Get distinct "Site_Code" field values.  Meant to be first query parameter, so does not accept query values.
        /// </summary>
        /// <param name="cancellationToken">AJAX cancellation token to permit cancellation of database call</param>
        /// <returns>Method returns a list SiteCode objects</returns>
        [Route("tblTVSM/site")]
        [HttpPost]
        public async Task<IEnumerable<SiteCode>> GetSites(CancellationToken cancellationToken)
        {

            string queryString = string.Format("select distinct Site_Code, BCA_Name from tblSite_Code");

            queryString += string.Format(" order by BCA_Name;");

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                return await connection.QueryAsync<SiteCode>(
                    new CommandDefinition(queryString, cancellationToken: cancellationToken)
                   );
            }
        }

        /// <summary>
        /// Get distinct field values that meet the criteria.  Generic implementation that returns distinct values from tblTVSM.
        /// </summary>
        /// <param name="values">Field name to get values from.  Taken from url.</param>
        /// <param name="values">Query criteria in the form of a javascript object.  Each database field is a property, and each property contains an array of strings.</param>
        /// <param name="cancellationToken">AJAX cancellation token to permit cancellation of database call</param>
        /// <returns>Method returns a list of strings</returns>
        [Route("fields/{table}/{field}")]
        [HttpPost]
        public async Task<IEnumerable<string>> GetGenericField(string table, string field, Dictionary<string, List<string>> values, CancellationToken cancellationToken)
        {

            var DbStructure = new DbStructure();
            var FieldInfo = DbStructure.ValidateField(table, field);
            if (FieldInfo == null)
            {
                return null;
            }
            string queryString = string.Format("select distinct [{0}] as fieldvalue from {1} where 1=1", field, FieldInfo.Item1);
            var dbArgs = new DynamicParameters();
            if (values != null)
            {
                foreach (var item in values)
                {
                    if (item.Value.Count > 0 && FieldInfo.Item2.Contains(item.Key))
                    {
                        var removeSpaces = item.Key.Replace(' ', '_');
                        if (item.Key == "Responsible")
                        {
                            queryString += string.Format(" and (Designer in @{0} or TIM in @{0} or Checker in @{0} or Releaser in @{0})", removeSpaces);
                        }
                        else
                        {
                            queryString += string.Format(" and [{0}] in @{1}", item.Key, removeSpaces);
                        }
                        List<string> searchValues = item.Value;
                        if (item.Key == "Form Type")
                        {
                            searchValues = DbStructure.GetFormTypeValues(item.Value);
                        }
                        dbArgs.Add(removeSpaces, searchValues);
                    }
                }
            }

            queryString += string.Format(" and [{0}] is not null and [{0}] != ''", field);

            queryString += string.Format(" order by [{0}];", field);

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                return await connection.QueryAsync<string>(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                   );
            }
        }

        
        [Route("count/{table}")]
        [HttpPost]
        public async Task<int?> GetCount(string table, Dictionary<string, List<string>> values, CancellationToken cancellationToken)
        {
            var DbStructure = new DbStructure();
            var FieldInfo = DbStructure.ValidateTable(table);
            if (FieldInfo == null)
            {
                return null;
            }
            string queryString = string.Format("select Count(*) from {0} where 1=1", FieldInfo.Item1);
            var dbArgs = new DynamicParameters();
            if (values != null)
            {
                foreach (var item in values)
                {
                    if (item.Key == "Order Start Status")
                    {
                        queryString += " and [Plan Status] in ('SFM', 'UNV')";
                    }
                    if (item.Value.Count > 0 && FieldInfo.Item2.Contains(item.Key))
                    {
                        var removeSpaces = item.Key.Replace(' ', '_');
                        if (item.Key == "Responsible")
                        {
                            queryString += string.Format(" and (Designer in @{0} or TIM in @{0} or Checker in @{0} or Releaser in @{0})", removeSpaces);
                        }
                        else
                        {
                            queryString += string.Format(" and [{0}] in @{1}", item.Key, removeSpaces);
                        }
                        List<string> searchValues = item.Value;
                        if (item.Key == "Form Type")
                        {
                            searchValues = DbStructure.GetFormTypeValues(item.Value);
                        }
                        dbArgs.Add(removeSpaces, searchValues);
                    }
                }
            }

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                return await connection.ExecuteScalarAsync<int>(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                   );
            }
        }

        /// <summary>
        /// Get order health values from tblTVSM to populate Schedule Health filter on client.
        /// </summary>
        /// <param name="values">Dictionary of filter selections</param>
        /// <param name="cancellationToken">AJAX cancellation token to permit cancellation of database call</param>
        /// <returns></returns>
        [Route("schedulehealth")]
        [HttpPost]
        public async Task<IHttpActionResult> GetHealthFromOrderss(Dictionary<string, List<string>> values, CancellationToken cancellationToken)
        {
            var DbStructure = new DbStructure();
            var FieldInfo = DbStructure.ValidateTable("tvsm");

            string queryString = @"select
    sum(case when [Order Start Status] = 'Red' then 1 else 0 end) Red,
    sum(case when [Order Start Status] = 'Green' then 1 else 0 end) Green,
    sum(case when [Order Start Status] = 'Yellow' then 1 else 0 end) Yellow,
    sum(case when [Order Start Status] = 'Gray' then 1 else 0 end) Gray 
    from tblTVSM where [Plan Status] in ('SFM', 'UNV')";
            var dbArgs = new DynamicParameters();
            if (values != null)
            {
                foreach (var item in values)
                {
                    if (item.Value.Count > 0 && FieldInfo.Item2.Contains(item.Key))
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
            }

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var res = await connection.QueryAsync(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                   );

                return Ok(res.FirstOrDefault());
            }

        }

        /// <summary>
        /// Generates health from tool orders based on planned start/comp dates and percentage complete.  Not required since values are being calculated in tblTVSM.
        /// </summary>
        /// <param name="start">Planned start date of order</param>
        /// <param name="comp">Planned end date of order</param>
        /// <param name="percent">Percentage complete</param>
        /// <returns>Method returns Health enum.</returns>
        private Health GetHealth(DateTime? start, DateTime? comp, int? percent){
            Health myHealth;
            double myPercent = System.Convert.ToDouble(percent) / 100;
            double duration, percentInDays, daysUntilToday;

            //Check if incoming values are null, and return an unassuming color if they are.
            if(start != null && comp != null){
                duration = (comp.Value - start.Value).TotalDays;
                percentInDays = duration * myPercent;
                daysUntilToday = (DateTime.Now - start.Value).TotalDays;

                if (daysUntilToday <= percentInDays)
                {
                    myHealth = Health.Green;
                }
                else //if (daysUntilToday > percentInDays)
                {
                    myHealth = Health.Yellow;
                }
                if (daysUntilToday > duration)
                {
                    myHealth = Health.Red;
                }
            }
            else{
                myHealth = Health.Gray;
            }

            return myHealth;
        }
    }
}
