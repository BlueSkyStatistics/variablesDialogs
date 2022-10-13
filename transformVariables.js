
var localization = {
    en: {
        title: "Transform Variable(s)",
        navigation: "Transform",
        label1: "Use the drop down to select the  operation (log, log10,as.numeric...) to transform the selected variables. You can overwrite existing variables or create new variables by specifying a prefix/suffix.",
        target: "Select the variable(s) to transform",
        selectctrl: "Select an operation to apply",
        label2: "Create new or overwrite existing variables",
        suffix: "Specify a suffix",
        prefix: "Specify a prefix",
        overwrite: "Overwrite",
        enterPrefix: "Enter a prefix",
        enterSuffix: "Enter a suffix",
        help: {
            title: "Transform Variables",
            r_help: "help(log, package ='base')",
            body: `
<b>Description</b></br>
Use the drop down to select the operation (log, log10,as.numeric...) to transform the selected variables. You can overwrite existing variables or create new variables by specifying a prefix/suffix.
<br/>
<b>Usage</b>
<br/>
<code> 
.GlobalEnv$dataset[,var] <-log(dataset[,var]) 
.GlobalEnv$dataset[,var] <-abs(dataset[,var])
.GlobalEnv$dataset[,var] <-ceiling(dataset[,var])
...
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
var: The variable to be transformed
</li>
<li>
Dataset: The dataset that contains the variable var
</li>
</ul>
<b>Value</b></br>
Transformed values are stored directly in the dataset</br>
<b>Package</b></br>
base</br>
<b>Help</b></br>
help(log, package ='base')
`}
    }
}









class transformVariables extends baseModal {
    constructor() {
        var config = {
            id: "transformVariables",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
local({
text =c("{{selected.enterPrefix | safe}}{{selected.enterSuffix | safe}}")
varNames =c({{selected.target | safe}})
#Create the new variable names with a prefix
if ("{{selected.grp10 | safe}}"=="Prefix") 
{
    newVarNames =paste (text,varNames, sep="_")
} else if ("{{selected.grp10 | safe}}"=="Suffix") 
{
#Create the new variable names with a suffix
    newVarNames =paste (varNames, text, sep="_")
}
i=1
for(var in varNames)
{
#Perform the transformation on each variable
if ("{{selected.grp10 | safe}}" =="Overwrite")
    {
    {{dataset.name}}[,var] <<-{{selected.selectctrl | safe}}({{dataset.name}}[,var])       
    } else 
    {
    {{dataset.name}}[,newVarNames[i]] <<-{{selected.selectctrl | safe}}({{dataset.name}}[,var])
    }
i=i+1
}
}
)
#Refresh the dataset in the grid
BSkyLoadRefresh("{{dataset.name}}")
`,
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            target: {
                el: new dstVariableList(config, {
                    label: localization.en.target,
                    no: "target",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
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
                    options: ["log10", "log", "log2", "abs", "ceiling", "floor", "factorial", "toupper", "tolower", "as.numeric", "as.character", "as.factor", "sqrt"]
                })
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, style: "mt-3",h: 5 }) },
            suffix: { el: new radioButton(config, { label: localization.en.suffix, no: "grp10", increment: "suffix", value: "Suffix", state: "checked", extraction: "ValueAsIs", dependant_objects: ["enterSuffix"] }) },
            enterSuffix: {
                el: new input(config, {
                    no: 'enterSuffix',
                    label: localization.en.enterSuffix,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    ml: 4,
                    type: "character"
                }),
            },
            prefix: { el: new radioButton(config, { label: localization.en.prefix, no: "grp10", increment: "prefix", value: "Prefix", state: "", extraction: "ValueAsIs", dependant_objects: ["enterPrefix"] }) },
            enterPrefix: {
                el: new input(config, {
                    no: 'enterPrefix',
                    label: localization.en.enterPrefix,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    ml: 4,
                    type: "character"
                }),
            },
            overwrite: { el: new radioButton(config, { label: localization.en.overwrite, no: "grp10", increment: "overwrite", value: "Overwrite", state: "", extraction: "ValueAsIs", }) },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.selectctrl.el.content, objects.label2.el.content, objects.suffix.el.content, objects.enterSuffix.el.content, objects.prefix.el.content, objects.enterPrefix.el.content, objects.overwrite.el.content,],
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
module.exports.item = new transformVariables().render()