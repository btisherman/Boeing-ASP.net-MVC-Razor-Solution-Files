using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TVSM.API.Modules.OpenSOW
{
    public class OpenSOWSummaryRow
    {
        public string Tool { get; set; }

        public string Program { get; set; }

        public string PST { get; set; }

        public string CCV_COMM { get; set; }

        public string CCV_SAFETY { get; set; }

        public int? UNV { get; set; }

        public int? SFM { get; set; }

        public int? Hrs_BTG_MES { get; set; }

        public int? AR { get; set; }

        public int? Hrs_BTG_AR { get; set; }

        public int? SAT { get; set; }

        public int? Hrs_BTG_SAT { get; set; }

        public int? NCR { get; set; }

        public int? Hrs_BTG_NCR { get; set; }

    }
}