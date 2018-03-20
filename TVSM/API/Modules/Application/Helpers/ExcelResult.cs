using Excel;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace TVSM.API.Modules.Application.Helpers
{
    /// <summary>
    /// Creates IHttpActionResult returning an excel file, from a strongly typed list. 
    /// </summary>
    /// <typeparam name="T">Type of list members</typeparam>
    public class ExcelResult<T> : IHttpActionResult
    {
        private List<T> _list;
        private string _filename;

        public ExcelResult(List<T> list, string filename)
        {
            _list = list;
            _filename = filename;
        }

        //Required method for IHttpActionResult.  Creates result content from stream, using CreateExcelFile helper library.
        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(new CreateExcel().ExcelFromList<T>(_list));
            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment") { FileName = _filename };
            result.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return Task.FromResult(result);
        }
    }
}