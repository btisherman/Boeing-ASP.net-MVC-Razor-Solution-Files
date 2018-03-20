(function () {
    angular.module('filterTools')

    .factory('DataService', ['$resource', '$http', function ($resource, $http) {
        var fields = $resource(server + '/api/tbltvsm/:field', { field: '@field' });

        var postFields = function (field, data) {
            return $http.post(server + '/api/tbltvsm/' + field, data)
        }

        var getFieldValues = function (table, field, data) {
            return $http.post(server + '/api/fields/' + table + '/' + field, data)
        }

        var getSelectionCount = function (table, data) {
            return $http.post(server + '/api/count/' + table, data)
        }

        var programs = {};
        programs.get = function () {
            return [
                '737',
                '737-700',
                '737 MAX',
                'P-8A',
                '747',
                '767',
                '767T',
                '777',
                '777X'
            ]
        }

        var fromUrl = function (url) {
            return $http.get(url);
        }

        var templates = {};
        templates.get = function () {
            return [
                {
                    display: '737 MAX ALL VALIDATED & COMMITTED',
                    selected: { "Program": ["737 MAX"], "Area": ["-"], "ACCP": ["-", "105", "118", "120", "125", "128", "128L6", "129", "130", "131", "131-2", "135", "166", "193", "193-3", "203", "204", "213", "218", "221", "222", "223", "227", "230", "231", "232", "233", "243", "291", "293", "294", "418", "509", "510", "511", "516", "517", "519", "520", "581", "651", "803", "841", "853", "88-", "885", "941", "953", "A32", "A3250-Z4B", "A71", "A87", "ADC", "ADC 9-101 BLDG", "AUB", "AUB -F85", "AUB A3250-Z4B", "AUB A8710-F85", "AUB-F85", "AUB-H51", "AUB-H52", "AUB-H83", "AUB-Z1E", "AUBURN", "BCW", "BNP", "BOP", "BP", "BSC", "BSL", "BSL 93-204", "BSL 93.204", "FRD", "Fre", "FRED", "N/A", "STO"], "Tooling Project": ["-"], "Plan Status": ["SFM"], "Form Type": ["DESIGN", "FAB/CONST"], "Work Area": ["88-53", "A3672-TD", "A3672-TME", "A3770-AMS", "A3770-IAS", "A3770-MF", "A3770-SNS", "A3770-TC", "A3770-TDC", "A3770-WS", "A3771-LIE", "A3771-MK", "A4691", "A5395", "A6810-NCQA", "A6816-QA", "A6894", "A7520-MPRF", "A8732-MPRF", "AC151-SSP", "AS748TDBSL", "AS755TCBSL", "N3604", "P3770-TE", "P4E38-TF", "P4R33-TF", "R3717-TR", "R3741-09", "R3774-06", "R3775-12", "RDES", "RW604-03", "STAGING", "TEST_TOOLS", "TIA"], "Tool Type": ["COMMITTED"] },
                    values: { "Program": ["737", "737-700", "737 MAX", "747", "767", "767T", "777", "777X"], "Area": ["-"], "ACCP": ["-", "105", "118", "120", "125", "128", "128L6", "129", "130", "131", "131-2", "135", "166", "193", "193-3", "203", "204", "213", "218", "221", "222", "223", "227", "230", "231", "232", "233", "243", "291", "293", "294", "418", "509", "510", "511", "516", "517", "519", "520", "581", "651", "803", "841", "853", "88-", "885", "941", "953", "A32", "A3250-Z4B", "A71", "A87", "ADC", "ADC 9-101 BLDG", "AUB", "AUB -F85", "AUB A3250-Z4B", "AUB A8710-F85", "AUB-F85", "AUB-H51", "AUB-H52", "AUB-H83", "AUB-Z1E", "AUBURN", "BCW", "BNP", "BOP", "BP", "BSC", "BSL", "BSL 93-204", "BSL 93.204", "FRD", "Fre", "FRED", "N/A", "STO"], "Tooling Project": ["-"], "Plan Status": ["CANC", "COMP", "DELETE", "SFM", "UNV"], "Form Type": ["DESIGN", "DETAIL", "MFG"], "Work Area": ["88-53", "A3672-TD", "A3672-TME", "A3770-AMS", "A3770-IAS", "A3770-MF", "A3770-SNS", "A3770-TC", "A3770-TDC", "A3770-WS", "A3771-LIE", "A3771-MK", "A4691", "A5395", "A6810-NCQA", "A6816-QA", "A6894", "A7520-MPRF", "A8732-MPRF", "AC151-SSP", "AS748TDBSL", "AS755TCBSL", "N3604", "P3770-TE", "P4E38-TF", "P4R33-TF", "R3717-TR", "R3741-09", "R3774-06", "R3775-12", "RDES", "RW604-03", "STAGING", "TEST_TOOLS", "TIA"], "Tool Type": ["COMMITTED", "ENG CHG", "IMPROVEMENT", "MAINTENANCE", "REMAKE", "SAFETY", "SUSTAINING"] }
                },
                {
                    display: '767 VALIDATED SAFETY',
                    selected:  {"Program":["767"],"Area":["-","Empennage","Engine Instl","ESRC","FA","Field","Final Assembly","Final Body Join","Flightline","Floors AFG","Interiors FA","Interiors FBJ","Interiors SI","IRC","J&I S&I","Refurb","Sec 41","Sec 41/43","Sec 43","Sec 45","Sec 46","Sec 48","SI AFT","SI FWD","STP&D","Wing Body Join","Wing Majors","Wing Panels","Wing Spars","Wing Stub Join"],"ACCP":[" 30"," 32"," AU"," N/"," NA","'16","'36","-","---","02","100","102","105","107","114","116","118","12/","120","121","121 1V","122","123","127","128","129","129 01W","130","131","132","15","152","155","175","182","189","1ns","1PF","1SF","200","201","202","203","204","206","207","211","218","221","270","272","296","297","2PC","300","303","303-1","3033","304","3041","309","311","312","314","315","316","316-A","317","319","320","322","324","325","328","329","330","331","334","335","336","341","342","364","365","366","367","370","379","397","3MB","400","472","489","496","4MS","4NN","506","509","510","511","516","517","520","521","522","532","543","581","582","5MB","5SC","619","655","6NN","705","708","805","806","808","820","823","824","826","840","843","846","861","922","939","940","961","970","980","A32","A37","A39","A3900","A70","a7000","A71","A7100","A7180","A7190","A72","A7200","A87","A8710-f85","ACCP 303","ALL","AOG","AP6","AP600","ATS","AUB","AUB A7000","AUB A7100","AUB A7110","AUB A7190","AUB-A7100","AUB-AW315","AUB-ES4","AUB-EXD","AUB-F85","AUB-F86","AUB-F89","AUB-F96","AUB-H83","AUB-Z2A","AUBURN","AW3","BOE","BOP","BP","CC ","CC 1211","CC1","CC129","cc2","CC3","cc304","CC320","D66","E37","ESR","EXC","EXD","EXG","F82","F85","F89","F91","FIE","FRD","FRE","FRED","H83","H85","HLN","HOT","KHI","MHI","MIN","MUL","N","N/A","NA","NEX","OP","PET","REP","SDC","SPA","SPI","SSA","T30","T48","TD5","TST","TW3","URA","WIR"],"Tooling Project":["-","246 Buttsplice","767-HOR-VER-MOV","8-Day Rate Enabler","CAN_DAG-FTG","Deck-plugs","F-DAG-FTG","F-Flex Track","FBJ Access Stand","Flex Track","JISIFR","Load Doc","Paddle Fittings","Safety","Shop Aid","Shop Aid/TR","Superpanel","Tanker","Tanker and Freighter","Tanker Freighter","Tanker-Flex Track","Tanker/ACT Tls"],"Plan Status":["SFM"],"Form Type":["DESIGN"],"Work Area":["A3670-TD","A3672-TD","A5395","AM221","ANIEV-00","EBN20-MHE","EHJEV","EHMAV-FT","EHMBV-ATG","N3604","P3770-TE"],"Tool Type":["SAFETY"]} ,
                    values: { "Program": ["737", "737-700", "737 MAX", "747", "767", "767T", "777", "777X"], "Area": ["-", "Empennage", "Engine Instl", "ESRC", "FA", "Field", "Final Assembly", "Final Body Join", "Flightline", "Floors AFG", "Interiors FA", "Interiors FBJ", "Interiors SI", "IRC", "J&I S&I", "Refurb", "Sec 41", "Sec 41/43", "Sec 43", "Sec 45", "Sec 46", "Sec 48", "SI AFT", "SI FWD", "STP&D", "Wing Body Join", "Wing Majors", "Wing Panels", "Wing Spars", "Wing Stub Join"], "ACCP": [" 30", " 32", " AU", " N/", " NA", "'16", "'36", "-", "---", "02", "100", "102", "105", "107", "114", "116", "118", "12/", "120", "121", "121 1V", "122", "123", "127", "128", "129", "129 01W", "130", "131", "132", "15", "152", "155", "175", "182", "189", "1ns", "1PF", "1SF", "200", "201", "202", "203", "204", "206", "207", "211", "218", "221", "270", "272", "296", "297", "2PC", "300", "303", "303-1", "3033", "304", "3041", "309", "311", "312", "314", "315", "316", "316-A", "317", "319", "320", "322", "324", "325", "328", "329", "330", "331", "334", "335", "336", "341", "342", "364", "365", "366", "367", "370", "379", "397", "3MB", "400", "472", "489", "496", "4MS", "4NN", "506", "509", "510", "511", "516", "517", "520", "521", "522", "532", "543", "581", "582", "5MB", "5SC", "619", "655", "6NN", "705", "708", "805", "806", "808", "820", "823", "824", "826", "840", "843", "846", "861", "922", "939", "940", "961", "970", "980", "A32", "A37", "A39", "A3900", "A70", "a7000", "A71", "A7100", "A7180", "A7190", "A72", "A7200", "A87", "A8710-f85", "ACCP 303", "ALL", "AOG", "AP6", "AP600", "ATS", "AUB", "AUB A7000", "AUB A7100", "AUB A7110", "AUB A7190", "AUB-A7100", "AUB-AW315", "AUB-ES4", "AUB-EXD", "AUB-F85", "AUB-F86", "AUB-F89", "AUB-F96", "AUB-H83", "AUB-Z2A", "AUBURN", "AW3", "BOE", "BOP", "BP", "CC ", "CC 1211", "CC1", "CC129", "cc2", "CC3", "cc304", "CC320", "D66", "E37", "ESR", "EXC", "EXD", "EXG", "F82", "F85", "F89", "F91", "FIE", "FRD", "FRE", "FRED", "H83", "H85", "HLN", "HOT", "KHI", "MHI", "MIN", "MUL", "N", "N/A", "NA", "NEX", "OP", "PET", "REP", "SDC", "SPA", "SPI", "SSA", "T30", "T48", "TD5", "TST", "TW3", "URA", "WIR"], "Tooling Project": ["-", "246 Buttsplice", "767-HOR-VER-MOV", "8-Day Rate Enabler", "CAN_DAG-FTG", "Deck-plugs", "F-DAG-FTG", "F-Flex Track", "FBJ Access Stand", "Flex Track", "JISIFR", "Load Doc", "Paddle Fittings", "Safety", "Shop Aid", "Shop Aid/TR", "Superpanel", "Tanker", "Tanker and Freighter", "Tanker Freighter", "Tanker-Flex Track", "Tanker/ACT Tls"], "Plan Status": ["CANC", "COMP", "DELETE", "SFM", "UNV"], "Form Type": ["COMPONENT", "DESIGN", "DETAIL", "MFG"], "Work Area": ["A3670-TD", "A3672-TD", "A5395", "AM221", "ANIEV-00", "EBN20-MHE", "EHJEV", "EHMAV-FT", "EHMBV-ATG", "N3604", "P3770-TE"], "Tool Type": ["COMMITTED", "ENG CHG", "IMPROVEMENT", "MAINTENANCE", "SAFETY", "STUDY", "SUPPLIER CHG", "SUSTAINING"] }
                }
            ]
        }

        var health = function (data) {
            return $http.post(server + '/api/schedulehealth', data);
        }
        
        return {
            fields: fields,   
            fromUrl: fromUrl,
            programs: programs,
            postFields: postFields,
            getFieldValues: getFieldValues,
            getSelectionCount: getSelectionCount,
            templates: templates,
            health: health
        };
    }]);
})();