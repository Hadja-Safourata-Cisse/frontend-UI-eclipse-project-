
export default class App {

  constructor(targetHtml) {
    this.targetHtml = targetHtml;
    this.controler();
  }

  controler() {

    this.targetHtml = jQuery("<div></div>").appendTo(this.targetHtml);
    var viewTarget = jQuery("<div></div>").appendTo(this.targetHtml);

    //Display Data using SimpleModel,   

    var simpleModel = new bcdui.core.SimpleModel({
      id: "simpleModel",
      url: new bcdui.core.RequestDocumentDataProvider({
        requestModel: new bcdui.core.ModelWrapper({ inputModel: bcdui.wkModels.guiStatus, chain: "generate.xslt" })
      }),

    });

    new bcdui.core.Renderer({
      inputModel: simpleModel,
      targetHtml: jQuery("<div></div>").appendTo(viewTarget),
    });

    //Display Data using AutoModell


    var autoModel = new bcdui.core.AutoModel({
      id: "countries",
      bRefs: "city city_ascii  lat lng country iso2 iso3 admin_name capital population id distancetocologne",
      filterBRefs: "country",
      bindingSetId: "myCities"
    });

    new bcdui.core.Renderer({
      inputModel: autoModel,
      targetHtml: jQuery("<div></div>").appendTo(viewTarget),
    });

    //transform km into miles with modelwrapp with javaScript


    var modelwrapJS = new bcdui.core.ModelWrapper({
      inputModel: new bcdui.core.SimpleModel({
        url:new bcdui.core.RequestDocumentDataProvider({
          requestModel: new bcdui.core.ModelWrapper({ inputModel: bcdui.wkModels.guiStatus, chain: "generate.xslt" })
        }),
      }),
      chain: function(doc) {
        Array.from(doc.selectNodes("/*/wrs:Data/wrs:R")).forEach(function(e) {
          e.selectSingleNode("wrs:C[12]").text *= 0.61371;
        })
      }
    })
   
    

    /*  var modelwrapJS = new bcdui.core.ModelWrapper({
        inputModel: simpleModel,
       chain: function(doc) {*/
    //   var IdColumn = doc.selectSingleNode("/*/wrs:Header/wrs:Columns/wrs:C[@id='distancetocologne']/@id").text;
    //    Array.from(doc.selectNodes("/*/wrs:Data/wrs:R")).forEach(function(e) {
    //     {
    /*       var value = bcdui.wrs.wrsUtil.getCellValue(doc, e.id, IdColumn) * 0.61371;
           bcdui.wrs.wrsUtil.setCellValue(doc, e.id, IdColumn, value);
           }
         })
        }
     });*/


    //transform km into miles with modelwrapp with xslt
    var modelwraperXslt = new bcdui.core.ModelWrapper({
      inputModel:new bcdui.core.AutoModel({
        bRefs: "city city_ascii  lat lng country iso2 iso3 admin_name capital population id distancetocologne",     
        bindingSetId: "myCities",
        filterBRefs: "country"
      }),
      chain: "transformation.xslt"
    });


    jQuery('input').on("click", function() {
      if ($(this).is(":checked")) {
        viewTarget.empty();
        new bcdui.core.Renderer({
          inputModel: modelwrapJS,
          targetHtml: jQuery("<div></div>").appendTo(viewTarget)
        });

        new bcdui.core.Renderer({
          inputModel: modelwraperXslt,
          targetHtml: jQuery("<div></div>").appendTo(viewTarget)
        });
      }

      if ($(this).is(":not(:checked)")) {

        viewTarget.empty();
        new bcdui.core.Renderer({
          inputModel: simpleModel,
          targetHtml: jQuery("<div></div>").appendTo(viewTarget),
        });

        new bcdui.core.Renderer({
          inputModel: autoModel,
          targetHtml: jQuery("<div></div>").appendTo(viewTarget),
        });


      }
    })

    //o Filter by country 

    new bcdui.core.AutoModel({
      id: "cities",
      bRefs: "country",
      bindingSetId: "myCities",
      isDistinct: true
    });


    bcdui.widgetNg.createSingleSelect({
      id: "countryChooser",
      targetHtml: jQuery("#countryChooserDiv"),
      targetModelXPath: "/*/f:Filter/f:Expression[@bRef = 'country' and @op = '=']/@value",
      optionsModelXPath: "$cities/*/wrs:Data/wrs:R/wrs:C"
    });

    bcdui.widgetNg.createButton({
      onClickAction: bcdui.core.lifecycle.applyAction,
      targetHtml: jQuery("#apply"),
      caption: 'Apply'
    });



    //creation of a gride
    // new bcdui.component.grid.Grid({targetHtml:jQuery("<div></div>").appendTo(this.targetHtml),inputModel: myCities});

    // new bcdui.component.grid.Grid({ targetHtml: this.targetHtml, inputModel: myCities });

  }
}







