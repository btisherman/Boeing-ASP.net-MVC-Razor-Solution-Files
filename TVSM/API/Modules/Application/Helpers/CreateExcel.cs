using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;

namespace Excel
{
    public class CreateExcel
    {
        private byte[] ExcelFromDT(DataTable tbl)
        {
            using (ExcelPackage pck = new ExcelPackage())
            {
                //Create the worksheet
                ExcelWorksheet ws = pck.Workbook.Worksheets.Add("Sheet 1");

                //Load the datatable into the sheet, starting from cell A1. Print the column names on row 1
                ws.Cells["A1"].LoadFromDataTable(tbl, true);

                //Format the header
                using (ExcelRange rng = ws.Cells[1, 1, 1, tbl.Columns.Count])
                {
                    rng.Style.Font.Bold = true;
                    rng.Style.Fill.PatternType = ExcelFillStyle.Solid;                      //Set Pattern for the background to Solid
                    rng.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(192, 192, 192));  //Set color to dark blue
                    rng.Style.Font.Color.SetColor(Color.Black);

                    rng.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    // Assign borders
                    rng.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    rng.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    rng.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    rng.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                }

                var dateColumns = from DataColumn d in tbl.Columns
                                  where d.DataType == typeof(DateTime)
                                  select d.Ordinal + 1;

                foreach (var dc in dateColumns)
                {
                    ws.Cells[2, dc, tbl.Rows.Count + 2, dc].Style.Numberformat.Format = "dd-mmm-yy";
                }

                //ws.Cells[2, tbl.Columns.Count, tbl.Rows.Count, tbl.Columns.Count].IsRichText = true;
                //ws.Cells[2, tbl.Columns.Count, tbl.Rows.Count, tbl.Columns.Count].RichText.Add("<span style='color:red'>hi</span>");

                //ws.Cells.AutoFitColumns();

                ////Example how to Format Column 1 as numeric 
                //using (ExcelRange col = ws.Cells[2, 1, 2 + tbl.Rows.Count, 1])
                //{
                //    col.Style.Numberformat.Format = "#,##0.00";
                //    col.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                //}
                return pck.GetAsByteArray();
            }
        }

        public byte[] ExcelFromList<T>(List<T> list)
        {
            var dt = ListToDataTable<T>(list);

            return ExcelFromDT(dt);
        }

        public DataTable ListToDataTable<T>(List<T> list)
        {
            bool header = true;
            DataTable dt = new DataTable();
            string columnName;

            foreach (T t in list)
            {

                DataRow row = dt.NewRow();
                foreach (PropertyInfo info in typeof(T).GetProperties())
                {
                    columnName = Attribute.IsDefined(info, typeof(DisplayAttribute)) ? info.GetCustomAttribute<DisplayAttribute>().Name : info.Name.Replace('_', ' ');
                    if (header)
                    {
                        dt.Columns.Add(new DataColumn(columnName, GetNullableType(info.PropertyType)));
                    }

                    if (!IsNullableType(info.PropertyType))
                    {
                        var value = info.GetValue(t, null);
                        row[columnName] = value;
                    }
                    else
                    {
                        var value = (info.GetValue(t, null) ?? DBNull.Value);
                        if (info.PropertyType == typeof(string))
                        {
                            var stringValue = value.ToString();
                            Regex tagRegex = new Regex(@"<[^>]+>");
                            if (tagRegex.IsMatch(stringValue))
                            {
                                var htmlDocument = new HtmlAgilityPack.HtmlDocument();
                                htmlDocument.LoadHtml(stringValue);
                                stringValue = HttpUtility.HtmlDecode(htmlDocument.DocumentNode.InnerText);
                            }

                            if (stringValue.Length > 32000)
                            {
                                stringValue = stringValue.Substring(0, 32000);
                            }

                            value = stringValue;
                        }
                        row[columnName] = value;
                    }

                }
                dt.Rows.Add(row);
                header = false;
            }
            return dt;
        }
        private Type GetNullableType(Type t)
        {
            Type returnType = t;
            if (t.IsGenericType && t.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
            {
                returnType = Nullable.GetUnderlyingType(t);
            }
            return returnType;
        }
        private bool IsNullableType(Type type)
        {
            return (type == typeof(string) ||
                    type.IsArray ||
                    (type.IsGenericType &&
                     type.GetGenericTypeDefinition().Equals(typeof(Nullable<>))));
        }

        private string GetColumnName(int index) // zero-based 
        {
            const byte BASE = 'Z' - 'A' + 1;
            string name = String.Empty;
            do
            {
                name = Convert.ToChar('A' + index % BASE) + name;
                index = index / BASE - 1;
            } while (index >= 0);
            return name;
        } 

    }
}