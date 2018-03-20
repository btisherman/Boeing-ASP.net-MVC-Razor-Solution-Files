using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TVSM.API.Modules.OpenSOW
{
    public class OpenSOWExcelExport
    {
        public string Program { get; set; }
        public string PST { get; set; }
        public string Tool_Number { get; set; }
        public int? Unit { get; set; }
        public string Key_ID { get; set; }
        public string Key_Type { get; set; }
        public string CCV { get; set; }
        public string RC { get; set; }
        public string Effectivity { get; set; }
        public string Plan_Status { get; set; }
        public int? Total_Est { get; set; }
        public string Sch_Comp { get; set; }
        public string Held_for { get; set; }
        public string RAMAC { get; set; }
        public DateTime? ECD { get; set; }
        public string Status_Description { get; set; }
        public string AssignedToName { get; set; }
        public DateTime? AssignDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string OrgPassedTo { get; set; }
        public string ProblemType { get; set; }
        public int? Rev { get; set; }
        public string Queue_ID { get; set; }
        public string ACCP { get; set; }
    }
}