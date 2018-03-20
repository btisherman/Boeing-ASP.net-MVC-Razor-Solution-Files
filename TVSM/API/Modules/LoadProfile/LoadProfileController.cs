using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TVSM.API.Modules.Application.Helpers;
using Dapper;

namespace TVSM.API.Modules.LoadProfile
{
    /// <summary>
    /// Endpoints for Load Profile Module.
    /// </summary>
    public class LoadProfileController : ApiController
    {
        /// <summary>
        /// Calls stored procedure to get load profile data.
        /// </summary>
        /// <param name="ids">Array of tool order IDs</param>
        /// <param name="interval">Time interval for data ("M": Month, "W": Week, "D": Day)</param>
        /// <returns>Load profile data to generate chart in client.</returns>
        [Route("webapi/loadprofiler/{interval}")]
        [HttpPost]
        public IEnumerable<dynamic> GetToolsFromPosters(string[] ids, string interval)
        {
            var intervals = new List<string>(){
                "M", //Month
                "W", //Week
                "D" //Day
            };

            if (!intervals.Contains(interval))
            {
                return null;
            }

            IEnumerable<dynamic> res;

            DataTable dt = new QueryHelper().getDataTableFromIDs(ids);

            using (IDbConnection connection = new DBConnection().OpenConnection())
            {
                res = connection.Query("dbo.uspSSRS_CapacityLoadRollup_NEW", new { OrderID = dt.AsTableValuedParameter("dbo.IDSTRING"), ChartType = interval },
                    commandType: CommandType.StoredProcedure);
            }

            return res;
        }
    }
}
