
export default class App {

  constructor(targetHtml) {
    this.targetHtml = targetHtml;
    this.controler();
  }

  controler() {


    //create a div and add it to the targetHtml div
    this.targetHtml = jQuery("<div></div>").appendTo(this.targetHtml);
    var viewTarget = jQuery("<div></div>").appendTo(this.targetHtml);

    // Display Data using SimpleModel,   

    var simpleModel = new bcdui.core.SimpleModel({
      id: "simpleModel",
      url: new bcdui.core.RequestDocumentDataProvider({
        requestModel: new bcdui.core.ModelWrapper({ inputModel: bcdui.wkModels.guiStatus, chain: "requestDoc/generate.xslt" })
      }),

    });

    new bcdui.core.Renderer({
      inputModel: simpleModel,
      targetHtml: jQuery("<div></div>").appendTo(viewTarget)
    });

    //Display Data using AutoModell

    var autoModel = new bcdui.core.AutoModel({
      id: "countries",
      bRefs: "city city_ascii  lat lng country iso2 iso3 admin_name capital population id distancetocologne",
      filterBRefs: "country city",
      bindingSetId: "myCities",

    });

    new bcdui.core.Renderer({
      inputModel: autoModel,
      targetHtml: jQuery("<div></div>").appendTo(viewTarget)
    });


    //  creation of the cube
    function cubeCreation() {
      viewTarget.empty();
      let cube = new bcdui.component.cube.Cube({ targetHtml: jQuery("<div></div>").appendTo(viewTarget) });
      cube.onceReady(function() {
        bcdui.component.createCubeConfigurator({
          targetHtml: jQuery("<div></div>").appendTo(viewTarget),
          cubeRenderer: cube.id,
          isDefaultHtmlLayout: true
        });
      });
    };

    //button to display the cube

    bcdui.widgetNg.createButton({
      onClickAction: cubeCreation,
      targetHtml: jQuery("#Cube"),
      caption: "Cube"
    });

    // Creation of the Grid

    function gridCreation() {
      viewTarget.empty();
      //DataProvider for the Grid Component      
      var worldcities = new bcdui.core.AutoModel({
        bRefs: "city city_ascii country iso2 iso3 admin_name capital population id",
        bindingSetId: "myCities",
        maxRows: 10
      });

      new bcdui.component.grid.Grid({
        targetHtml: jQuery("<div></div>").appendTo(viewTarget),
        inputModel: worldcities,
        contextMenu: true,
        allowNewRows: true
      })
    }
    //button to display the grid

    bcdui.widgetNg.createButton({
      onClickAction: gridCreation,
      targetHtml: jQuery("#Grid"),
      caption: "Grid"
    });

    //client side with ModelWrapper (JS and XSLT)

    //transform km into miles with modelwrapp with xslt
    var modelwraperXslt = new bcdui.core.ModelWrapper({
      inputModel: new bcdui.core.AutoModel({
        bRefs: "city city_ascii  lat lng country iso2 iso3 admin_name capital population id distancetocologne",
        bindingSetId: "myCities",
        filterBRefs: "country"
      }),
      chain: "transformation.xslt"
    });

    //transform km into miles with modelwrapp with javaScript

    var modelwrapJS = new bcdui.core.ModelWrapper({
      inputModel: new bcdui.core.AutoModel({
        bRefs: "city city_ascii  lat lng country iso2 iso3 admin_name capital population id distancetocologne",
        bindingSetId: "myCities"
      }),
      chain: function(doc) {
        Array.from(doc.selectNodes("/*/wrs:Data/wrs:R")).forEach(function(e) {
          e.selectSingleNode("wrs:C[position()=12]").text *= 0.61371;
        })
      }
    })
    
    //so that the user can switch between km and miles

    jQuery("#check").on("click", function() {
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


    // DataProvider for the filters
    
    new bcdui.core.AutoModel({
      id: "cities",
      bRefs: "country",
      filterBRefs: "country",
      bindingSetId: "myCities",
      isDistinct: true,
      isAutoRefresh: true
    });
    
    //Filter by Country

    bcdui.widgetNg.createSingleSelect({
      id: "countryChooser",
      targetHtml: jQuery("#countryChooserDiv"),
      targetModelXPath: "/*/f:Filter/f:Expression[@bRef = 'country' and @op = '=']/@value",
      optionsModelXPath: "$cities/*/wrs:Data/wrs:R/wrs:C",
      label: "FilterCountry"
    });

    bcdui.widgetNg.createButton({
      onClickAction: bcdui.core.lifecycle.applyAction,
      targetHtml: jQuery("#apply"),
      caption: 'apply'
    });

    //Dimension Chooser

    bcdui.widget.createDimensionChooser({
      targetModelXPath: "$guiStatus/*/f:Filter/f:And[@id = 'myDimensionChooser']/@value",
      targetHtml: jQuery('#dimensionChooser'),
      dimension: "myDimension",
      id: "Dimension",
      label: "DimensionChooser",
      multiSelect: 'check'
    });


//a dataprovider for the cities of origin

    var originCity = new bcdui.core.AutoModel({
      id: "originCity",
      bRefs: "originCity",
      bindingSetId: "myBooking",
      filterBRefs: "originCity ",
      maxRows: 20,
      isAutoRefresh: true
    });
    
//a dataprovider for destination cities    

    var destinationCity = new bcdui.core.AutoModel({
      id: "destinationCity",
      bRefs: "destinationCity",
      bindingSetId: "myBooking",
      filterBRefs: "destinationCity ",
      maxRows: 20,
      isAutoRefresh: true
    });

//so that the user can select a city of origin

    bcdui.widgetNg.createSingleSelect({
      id: "OriginCountry",
      targetHtml: jQuery("#origCountry"),
      targetModelXPath: "/*/f:Filter/f:Expression[@bRef = 'originCity' and @op = '=']/@value",
      optionsModelXPath: "$originCity/*/wrs:Data/wrs:R/wrs:C",
      label: "Origin City"
    });

//so that the user can select a destination city

    bcdui.widgetNg.createSingleSelect({
      id: "destinationCountry",
      targetHtml: jQuery("#destCountry"),
      targetModelXPath: "/*/f:Filter/f:Expression[@bRef = 'destinationCity' and @op = '=']/@value",
      optionsModelXPath: "$destinationCity/*/wrs:Data/wrs:R/wrs:C",
      label: "Destination City"
    });

    // button to see the reservation 
    bcdui.widgetNg.createButton({
      targetHtml: jQuery("#booking"),
      caption: 'Seebooking',
      onClickAction: function() {
        viewTarget.empty();
        new bcdui.core.Renderer({
          inputModel: originCity,
          targetHtml: jQuery("<div></div>").appendTo(viewTarget)
        });
        new bcdui.core.Renderer({
          inputModel: destinationCity,
          targetHtml: jQuery("<div></div>").appendTo(viewTarget)
        })
      }
    })
    
    //a button to delete the reservation

    bcdui.widgetNg.createButton({
      targetHtml: jQuery("#deletebooking"),
      caption: 'deleteBooking',
      onClickAction: function() {
        viewTarget.empty()
        bcdui.wrs.wrsUtil.deleteRows({
          model:originCity,
          rowStartPos:1
        }),
        bcdui.wrs.wrsUtil.deleteRows({
          model:destinationCity,
          rowStartPos:1
        })
      }
    })

  }
}



