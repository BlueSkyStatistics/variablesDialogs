
var localization = {
    en: {
        title: "Conditional Compute",
        navigation: "Conditional Compute",
        label1: "=",
        newvar: "New/Existing Variable name (no spaces/special characters):",
        formulaBuilderCondition: "Specify a condition e.g. var1 > 10",
        formulaBuilderConditionTrue: "Value when condition is TRUE",
        formulaBuilderConditionFalse: "Value when condition is FALSE",
        label2: "Construct the appropriate compute command using the expression builder below, for e.g. var1+var2, as.numeric(var2), substr(var4,2,4)...",
        formula: "Construct a compute command",
        help: {
            title: "Compute Variable(s)",
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











class conditionalCompute extends baseModal {
    constructor() {
        var config = {
            id: "conditionalCompute",
            label: localization.en.title,
            splitProcessing:false,
            modalType: "two",
            RCode: `
require(stringr);
require(dplyr);
#If you are computing a new variable, we initialize the new variable to hold NAs
if ( is.null({{dataset.name}}\${{selected.newvar | safe}}))
{
    {{dataset.name}}\${{selected.newvar | safe}} <-NA
}
#Runs the conditional compute
{{dataset.name}}\${{selected.newvar | safe}} <- with( {{dataset.name}}, ifelse( {{selected.formulaBuilderCondition | safe}}, 
    {{selected.formulaBuilderConditionTrue | safe}}, {{selected.formulaBuilderConditionFalse | safe}} ) )
#Refreshes the dataset in the grid
BSkyLoadRefresh("{{dataset.name}}")
`,
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {scroll: true}) },
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
            label2: { el: new labelVar(config, { label: localization.en.label2, h: 6 }) },
            formulaBuilderCondition: {
                el: new computeBuilder(config, {
                    no: "formulaBuilderCondition",
                    required:true,
                    label :localization.en.formulaBuilderCondition
                })
            },
            formulaBuilderConditionTrue: {
                el: new computeBuilder(config, {
                    no: "formulaBuilderConditionTrue",
                    required:true,
                    label :localization.en.formulaBuilderConditionTrue
                })
            },
            formulaBuilderConditionFalse: {
                el: new computeBuilder(config, {
                    no: "formulaBuilderConditionFalse",
                    required:true,
                    label :localization.en.formulaBuilderConditionFalse
                })
            },
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.newvar.el.content, objects.label1.el.content, objects.label2.el.content, objects.formulaBuilderCondition.el.content,objects.formulaBuilderConditionTrue.el.content,objects.formulaBuilderConditionFalse.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-sqrt_qmark",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new conditionalCompute().render()