
var localization = {
    en: {
        title: "Applying a function to all rows of selected variable(s).",
        navigation: "Apply a function to rows",
        label1: "Create a new variable or overwrite an existing variable by applying a function to all row values of the selected variable(s).",
        newvar: "Enter a new variable/Overwrite an existing variable",
        target: "Select variable(s)",
        selectctrl: "Select an operation to apply",
        help: {
            title: "Applying a function",
            r_help: "help(apply,package='base')",
            body: `
<b>Description</b></br>
Applies a function across all rows of the selected variables (columns) in a dataset. We use the select function and the pipe ( %>% ) operator from the dplyr package to select the variables whose rows we will apply a function to. (These variables are piped into the apply function)
<br/>
<b>Usage</b>
<br/>
<code> 
dataset_name$new_variable <-dataset_name  %>% select(var1,var2) %>% apply(1, function_name, na.rm = TRUE)
apply(X, MARGIN, FUN, ...)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
X: An array including a matrix. The selected variables are piped in via dplyr
</li>
<li>
MARGIN: The a vector giving the subscripts which the function will be applied over. E.g., for a matrix 1 indicates rows, 2 indicates columns, c(1, 2) indicates rows and columns. Where
X has named dimnames, it can be a character vector selecting dimension names.dataset that contains the variable var
</li>
<li>
FUN: The function to be applied
</li>
</ul>
<b>Value</b><br/>
Computed values are stored directly in Dataset
<b>Package</b></br>
dplyr</br>
<b>Help</b></br>
help(apply)
`}
    }
}









class applyFunctionAcrossRows extends baseModal {
    constructor() {
        var config = {
            id: "applyFunctionAcrossRows",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(dplyr)
#Apply function to all rows
{{dataset.name}}\${{selected.newvar | safe}} <-{{dataset.name}}  %>%\n\tdplyr::select({{selected.target | safe}}) %>%\n\tbase::apply(1, {{selected.selectctrl | safe}}, na.rm = TRUE)
#Refresh the dataset in the grid
BSkyLoadRefresh("{{dataset.name}}")
            `
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
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
            target: {
                el: new dstVariableList(config, {
                    label: localization.en.target,
                    no: "target",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            selectctrl: {
                el: new comboBox(config, {
                    no: 'selectctrl',
                    label: localization.en.selectctrl,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    required: true,
                    default: "mean",
                    options: ["mean", "median", "min", "max", "sd", "sum", "var",]
                })
            },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.newvar.el.content, objects.target.el.content, objects.selectctrl.el.content,],
            nav: {
                name: localization.en.navigation,
                icon: "icon-calculator_across_rows",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new applyFunctionAcrossRows().render()