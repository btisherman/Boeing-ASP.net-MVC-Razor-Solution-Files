using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TVSM.API.Modules.Application.Helpers
{
    public class DbStructure
    {
        public Dictionary<string, Tuple<string, List<string>>> GetDbStructure()
        {
            var dbStruct = new Dictionary<string, Tuple<string, List<string>>>();
            //Construct allowable fields for table TVSM.  Dictionary key represents value for caller,
            //Tuple value 1 represents the actual database table name, Tuple value 2 represents
            //allowable field values.
            dbStruct.Add("tvsm", new Tuple<string, List<string>>("tblTVSM", new List<string>(){
                "Program",
                "Area",
                "ACCP",
                "Tooling Project",
                "Plan Status",
                "Form Type",
                "Work Area",
                "Tool Type",
                "Order ID",
                "Responsible",
                "Est Confirmed",
                "Order Start Status",
                "Active Op Area"
            }));
            dbStruct.Add("opensow", new Tuple<string, List<string>>("tblOpen_SOW_Summary", new List<string>(){
                "ProgramX",
                "PST"
            }));
            dbStruct.Add("etvsmetrics", new Tuple<string, List<string>>("GlobalMetricDashboard_v", new List<string>(){
                "Site",
                "Program"
            }));

            return dbStruct;
        }

        public Tuple<string, List<string>> ValidateField(string table, string field)
        {
            var dbStruct = GetDbStructure();

            if (dbStruct.ContainsKey(table) && dbStruct[table].Item2.Contains(field, StringComparer.OrdinalIgnoreCase))
            {
                return dbStruct[table];
            }
            else
            {
                return null;
            }
        }

        public Tuple<string, List<string>> ValidateTable(string table)
        {
            var dbStruct = GetDbStructure();

            if (dbStruct.ContainsKey(table))
            {
                return dbStruct[table];
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Get values that correspond with the user selectable form type.
        /// </summary>
        /// <param name="p">List of selected form types</param>
        /// <returns>Method returns a list of strings</returns>
        public List<string> GetFormTypeValues(List<string> p)
        {
            var result = new List<string>();
            if (p.Contains("DESIGN"))
            {
                result.Add("DESI");
                result.Add("DESIGN");
                result.Add("STDR");
                result.Add("TDR");
            }
            if (p.Contains("MFG"))
            {
                result.Add("MFG");
                result.Add("STF");
                result.Add("TF");
            }
            if (p.Contains("DETAIL"))
            {
                result.Add("COMPONENT");
                result.Add("DETAIL");
            }
            return result;
        }
    }
}