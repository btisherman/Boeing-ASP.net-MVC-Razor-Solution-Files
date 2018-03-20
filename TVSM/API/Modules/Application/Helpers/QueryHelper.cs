using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace TVSM.API.Modules.Application.Helpers
{
    public class QueryHelper
    {
        /// <summary>
        /// Creates a datatable object from an array of strings.
        /// </summary>
        /// <param name="ids"></param>
        /// <returns>Method returns a datatable object with a single ID column</returns>
        public DataTable getDataTableFromIDs(string[] ids)
        {
            var dt = new DataTable();
            dt.Columns.Add("ID", typeof(string));
            foreach (string id in ids)
            {
                dt.Rows.Add(id);
            }

            return dt;
        }
    }
}