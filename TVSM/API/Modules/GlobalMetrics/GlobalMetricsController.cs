using Dapper;
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
using TVSM.API.Modules.GlobalMetrics.Models;

namespace TVSM.API.Modules.GlobalMetrics
{
    [RoutePrefix("api/globalmetrics")]
    public class GlobalMetricsController : ApiController
    {
        
        [Route("metrics")]
        [HttpPost]
        public async Task<IHttpActionResult> GetMetrics(Dictionary<string, List<string>> values, CancellationToken cancellationToken)
        {
            var DbStructure = new DbStructure();
            var FieldInfo = DbStructure.ValidateTable("etvsmetrics");

            string queryString = @"select * from GlobalMetricDashboard_v where 1=1";
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
                        dbArgs.Add(removeSpaces, searchValues);
                    }
                }
            }

            IEnumerable<GlobalMetricModel> res;
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                res = await connection.QueryAsync<GlobalMetricModel>(
                    new CommandDefinition(queryString, dbArgs, cancellationToken: cancellationToken)
                   );

                return Ok(res);
            }
        }

    }
}
