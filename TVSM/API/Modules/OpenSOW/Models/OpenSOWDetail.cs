using System.Collections.Generic;

namespace TVSM.API.Modules.OpenSOW
{
    public class OpenSOWDetail
    {
        public string Tool { get; set; }
        public string Program { get; set; }
        public string PST { get; set; }
        public bool IsComm { get; set; }
        public bool IsSafe { get; set; }
        public IEnumerable<OpenSOWRow> UNV { get; set; }
        public IEnumerable<OpenSOWRow> SFM { get; set; }
        public IEnumerable<OpenSOWRow> AR { get; set; }
        public IEnumerable<OpenSOWRow> NCR { get; set; }
        public IEnumerable<OpenSOWRow> SAT { get; set; }
    }
}