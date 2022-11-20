
var localization = {
    en: {
        title: "Compute Variable",
        navigation: "Compute",
        label1: "=",
        newvar: "New/Existing Variable name (no spaces/special characters):",
        label2: "Expression Builder:",
        formula: "Construct a compute command",
        placeHolder: "For e.g. var1+var2+ceiling(var3)",
        help: {
            title: "Compute Variable",
            r_help: "help(log, package ='base')",
            body: `
<b>Description</b></br>
Computes an expression and stores the result in a variable/column of a dataframe/dataset</br>
<br/>
<b>Usage</b>
<br/>
<code> 
DatasetX <- DatasetX %>% mutate ( var1 = Expression)​<br/>
DatasetX <- DatasetX %>% mutate ( var1 = var2 + var3)​
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
DatasetX:  dataframe/dataset name.​
</li>
<li>
var1: The new/existing column in the dataset/dataframe that needs to be computed
</li>
<li>
Expression: An expression in the form variable1 =variable2+variable3
</li>
</ul>
<b>Details</b></br>
Evaluates the expression and stores the result in variable/column of a dataframe/dataset</br>
<b>Package</b></br>
dplyr</br>
<b>Help</b></br>
For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command help(mutate, package ='dplyr') in the R editor window
            `}
    }
}











class computeVariable extends baseModal {
    constructor() {
        var config = {
            id: "computeVariable",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(stringr);
require(dplyr);

## support for design object. 
### backup current attributes if design object
isdesign = FALSE
backupattr = NULL
if(c("design") %in% class({{dataset.name}}))
{
    isdesign = TRUE
    dsattr = attributes({{dataset.name}})
    # backup all except names and row.names because new col may get added 
    backupattr = dsattr[!(names(dsattr) %in% c("names", "row.names"))]
}

#Computes the new/existing column
local({tryCatch({ .GlobalEnv\${{dataset.name}} <- {{dataset.name}} %>% mutate( {{selected.newvar |safe}} = {{selected.formula | safe}} )}, error = function(e){  cat(conditionMessage(e))} )})

### restore design attributes
if(isdesign)
{
    attributes({{dataset.name}}) = c(attributes({{dataset.name}}), backupattr)
}

#Refresh the dataset in the data grid
BSkyLoadRefresh("{{dataset.name}}")
`,
        }
        var objects = {
            content_var: { el: new srcVariableList(config) },
            newvar: {
                el: new input(config, {
                    no: 'newvar',
                    label: localization.en.newvar,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    type: "character",
                    overwrite: "variable",
                    required: true
                }),
            },
            formulaBuilder: {
                el: new computeBuilder(config, {
                    no: "formula",
                    required:true,
                    label: localization.en.label2,
                    placeHolder: localization.en.placeHolder
                })
            },
          
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.newvar.el.content, objects.formulaBuilder.el.content ],
            nav: {
                name: localization.en.navigation,
                icon: "icon-sqrt_x",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new computeVariable().render()