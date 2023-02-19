
var localization = {
    en: {
        title: "Replace Missing Values (String/Factor Variables)",
        navigation: "Character/Factor",
        destination: "Destination Variables",
        repString: "Enter string to replace NAs by. Note: Don't enclose the string by quotes. For factor variables, the specified value must be a level of the factor, see Variables>Factor Levels>Add",
        help: {
            title: "Replace Missing Values (String/Factor Variables)",
            r_help: "help(is.na,package=base)",
            body: `
<b>Description</b></br>
Replace missing values in the variables selected by the specified value. When using the dialog, you don't have to enclose the string in double quotes
<br/>
<b>Usage</b>
<br/>
<code> 
Dataset[,c('var1','var2')] [is.na(Dataset[,c('var1','var2')])] <- c('String to replace')
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
The dataset variables (var1, var2) where NAs need to be replaced
</li>
</ul>
<b>Value</b><br/>
Replaces the missing values in the dataset with the sting specified<br/>
<b>Package</b></br>
base</br>
<b>Help</b></br>
help(is.na,package=base)`}
    }
}







class replaceMissingValues extends baseModal {
    constructor() {
        var config = {
            id: "replaceMissingValues",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
#[Replaces NAs in factor and string variables by the specified value]
#For factor variables, the specified value must be a level of the factor
#You can add levels by right clicking on the variable in the variable grid and selecting "Add new level"
{{dataset.name}}[,c({{selected.destination | safe}})]  [is.na({{dataset.name}}[,c({{selected.destination | safe}})])] <- c("{{selected.repString | safe}}")
#Refreshes the dataset in the data grid
BSkyLoadRefresh("{{dataset.name}}")  
`
        }
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            destination: {
                el: new dstVariableList(config, {
                    label: localization.en.destination,
                    no: "destination",
                    filter: "String||Date|Logical|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            repString: {
                el: new input(config, {
                    no: 'repString',
                    label: localization.en.repString,
                    placeholder: "",
                    allow_spaces:true,
                    extraction: "TextAsIs",
                    value: "",
                    required: true,
                }),
            },
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.destination.el.content, objects.repString.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-abc",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new replaceMissingValues().render()