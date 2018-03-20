using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TVSM.API.Modules.OpenSOW
{
    public class OpenSOWExcelPost
    {
        public string Program { get; set; }
        public string Area { get; set; }
        public string Tool { get; set; }

        public Dictionary<string, List<string>> ToDictionary()
        {
            var dict = new Dictionary<string, List<string>>();
            dict.Add("Program", getList(Program));
            dict.Add("Area", getList(Area));
            dict.Add("Tool", getList(Tool));

            return dict;
        }

        private List<string> getList(string field) {
            if (field == null)
            {
                return new List<string>();
            }
            else
            {
                return field.Split(',').ToList();
            }
            
        }
    }
}