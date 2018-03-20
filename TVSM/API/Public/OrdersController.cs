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
using TVSM.API.Public.Models;
using TVSM.Security;

namespace TVSM.API.Public
{
    [RoutePrefix("api/public/orders")]
    public class OrdersController : ApiController
    {
        [SkipXSRF]
        [Route("detail/{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetHFHealth(string id, CancellationToken cancellationToken)
        {
            string queryString = @"select [Order ID] AS [Order],
                [Tool Number] AS Tool,
                [Scheduled Complete] AS ScheduledComplete,
                [TotalEst] AS Estimate,
                [Actual Est] AS Actual 
                from tblTVSM where [Order ID] = @id";
            
            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                var res = await connection.QueryAsync<OrderDetail>(
                    new CommandDefinition(queryString, new {id = id}, cancellationToken: cancellationToken)
                   );

                return Ok(res.FirstOrDefault());
            }
        }
    }
}
