using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace TVSM
{
    public static class BundleConfig
    {
            public static void RegisterBundles(BundleCollection bundles) {

                bundles.Add(new StyleBundle("~/css/bootstrap")
                    .Include("~/common/css/reset.css")
                    .Include("~/Content/bootstrap.css")
                    .Include("~/common/css/boeing.3.0.9.css")
                    .Include("~/common/css/loading-bar.css")
                    .Include("~/common/css/custom.css")
                    .Include("~/Scripts/nv.d3.css"));

                bundles.Add(new StyleBundle("~/css/custom")
                    .IncludeDirectory("~/ngApp", "*.css", true));

                bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                 "~/Scripts/jquery-{version}.js"));

                bundles.Add(new ScriptBundle("~/bundles/angular")
                    .Include("~/Scripts/angular.js")
                 .Include("~/Scripts/angular-loading-bar.js")
                 .Include("~/Scripts/angular-resource.js")
                 .Include("~/Scripts/angular-route.js")
                 .Include("~/Scripts/angular-ui/ui-bootstrap-tpls.js")
                 .Include("~/Scripts/angular-cookies.js")
                 .Include("~/Scripts/angular-animate.js")
                 .Include("~/Scripts/angular-sanitize.js")
                 .Include("~/Scripts/ng-infinite-scroll.min.js"));

                bundles.Add(new ScriptBundle("~/bundles/d3")
                    .Include("~/Scripts/d3/d3.js")
                    .Include("~/Scripts/nv.d3.js")
                    .Include("~/Scripts/angular-nvd3.js"));

                bundles.Add(new ScriptBundle("~/bundles/app")
                .Include("~/common/js/polyfill.js")
                //.Include("~/Scripts/pdfmake.js")
                //.Include("~/Scripts/vfs_fonts.js")
                .Include("~/Scripts/jspdf.js")
                .Include("~/Scripts/html2canvas.js")
                .IncludeDirectory("~/ngApp", "*.js", true));

                var partials = new PartialsBundle("myApp","~/bundles/partials")
                .IncludeDirectory("~/ngApp", "*partial.html", true);
                bundles.Add(partials);

                //BundleTable.EnableOptimizations = false;
            }
    }
}