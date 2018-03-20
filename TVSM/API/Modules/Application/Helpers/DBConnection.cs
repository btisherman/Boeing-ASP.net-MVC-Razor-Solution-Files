using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace TVSM.API.Modules.Application.Helpers
{
    public class DBConnection
    {
        /// <summary>
        /// Provides a database connection from the web.config connection string.
        /// </summary>
        /// <returns>Method returns an IDbConnection object</returns>
        public IDbConnection OpenConnection(string connectionName = "tvsm")
        {
            var connectionString = ConfigurationManager.
    ConnectionStrings[connectionName].ConnectionString;
            return new SqlConnection(connectionString);
        }
    }
}