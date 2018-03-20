using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using Dapper;
using System.Configuration;
using System.Data.SqlClient;

namespace TVSM.Security
{
    class UserRepo       
    {

        //public async Task<List<User>> getUserRolesAsync(string id)
        //{
        //    var queryString = "select * from Users where UserId=@id";
        //    using (IDbConnection connection = OpenConnection())
        //    {
        //        var res = await connection.QueryAsync<User>(queryString, new { id });
        //        return res.ToList();
        //    }
        //}

        public List<User> getUserRoles(string id)
        {
            var queryString = "select BEMSID, Position as Role from tblUsers where BemsId=@id";
            using (IDbConnection connection = OpenConnection())
            {
                var res = connection.Query<User>(queryString, new { id });
                return res.ToList();
            }
        }

        private IDbConnection OpenConnection()
        {
            var connectionString = ConfigurationManager.
    ConnectionStrings["tvsm"].ConnectionString;
            return new SqlConnection(connectionString);
        }
    }
}
