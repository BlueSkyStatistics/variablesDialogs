
var localization = {
    en: {
        title: "Delete Variables",
        navigation: "Delete",
        trg: "Variables to be deleted",
        help: {
            title: "Remove NAs",
            r_help: "help(na.omit, package=data.table)",
            body: `
<b>Description</b></br>
Remove missing values/NA from dataset/dataframe
Creates new/Overwrites existing dataset by removing rows with one or more missing values for the columns/variable names selected
<br/>
<b>Usage</b>
<br/>
<code> 
na.omit(object =dataset[c(var1,var2...]))​
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
​object: an R object.​
</li>
</ul>
<b>Package</b></br>
data.table</br>
<b>Help</b></br>
help(na.omit)
`}
    }
}






class deleteVariables extends baseModal {
    constructor() {
        var config = {
            id: "deleteVariables",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
#Deletes the specified variables
{{dataset.name}} <- {{dataset.name}} %>% \n\tdplyr::select(-c({{selected.trg | safe}}))
BSkyLoadRefresh("{{dataset.name}}")
`
        }
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            trg: {
                el: new dstVariableList(config, {
                    label: localization.en.trg,
                    no: "trg",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true
                }), r: ['{{ var | safe}}']
            },
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.trg.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-trash",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new deleteVariables().render()