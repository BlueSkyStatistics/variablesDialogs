
var localization = {
    en: {
        title: "Conditional Compute, multiple",
        navigation: "Conditional Compute, multiple",
        newvar: "New/Existing Variable name (no spaces/special characters):",
        label2: "Expression Builder: Construct the desired expression, for e.g. var1+var2, as.numeric(var2), substr(var4,2,4)...",
        formula: "Construct a compute command",
        help: {
            title: "Conditional Compute, multiple",
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






class conditionalComputeMayo extends baseModal {
    constructor() {
        var config = {
            id: "conditionalComputeMayo",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(stringr);
require(dplyr);
#Computes the new/existing column
local({tryCatch({ .GlobalEnv\${{dataset.name}} <- {{dataset.name}} %>% mutate({{selected.newvar |safe}} = {{selected.swCase | safe}} )}, error = function(e){  cat(conditionMessage(e))} )})
#Refresh the dataset in the data grid
BSkyLoadRefresh("{{dataset.name}}")
`,
        }
        var objects = {
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
            swCase: {
                el: new switchCase(config, {
                    no: "swCase",
                    label: "",
                    placeholder: "",
                    extraction: "TextAsIs",
                    type: "character"
                })
            }, 
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.newvar.el.content, objects.swCase.el.content ],
            nav: {
                name: localization.en.navigation,
                icon: "icon-sqrt_x",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }

    prepareExecution(instance) {
        let res = [];
        let temp = "";
      
            var code_vars = {
                dataset: {
                    name: getActiveDataset()
                },
                selected: {
                    newvar: instance.objects.newvar.el.getVal(),
                    swCase: instance.objects.swCase.el.getVal(),
                   
                }
            }
            code_vars.selected.swCase = constructIfElse(code_vars.selected.swCase)
            let cmd = instance.dialog.renderR(code_vars)
            cmd = removenewline(cmd);
            temp = temp + cmd + "\n";
            
        res.push({ cmd: temp, cgid: newCommandGroup() })
        return res;
    }
}
module.exports.item = new conditionalComputeMayo().render()


function constructIfElse(swCase) {
    let if_elements =[];
    let then_elements = []
    let else_elements =[]
    let temp =""
    let hydratedSwCase = JSON.parse(swCase);
    hydratedSwCase.forEach(function (value) {
        if (value.switch != undefined )
        {
            if ( value.switch != "")
            {
                if_elements.push(value.switch)
                then_elements.push(value.case)
            }
        }
        if (value.else != undefined )
        {
            if ( value.else != "")
            {
                else_elements.push(value.else)
            }
        }
    })
    let closingBracket = ")"
    for (var i = 0 ; i < if_elements.length; i ++) 
    {
        temp = temp + "\n\tifelse(" + if_elements[i] + "," + then_elements[i] + ","
    }
    if (else_elements[0] !=undefined)
    {
        temp += else_elements[0]
    }
    else
    {
        temp += "NA"
    }
    temp = temp + closingBracket.repeat(i)
    return temp
}
