
var localization = {
    en: {
        title: "Remove NAs",
        navigation: "Remove NAs",
        label0: "Creates new/Overwrites existing dataset by removing rows with one or more missing values. Select the variables to be analyzed for missing values. All rows containing missing values in variables selected will be removed. To analyze the entire dataset, select all variables.",
        label1: "Options",
        New: "Save results to a new dataset",
        newdatasetname: "Enter a dataset name",
        Existing: "Overwrite existing dataset",
        subsetvars: "Select variables (one or more) to include in the dataset",
        subsetexpression: "Enter subsetting criteria. Subsetting criteria is applied against each dataset row. Example 1: !is.na(var1) & is.na(var2). Example 2: var1>30 & var2=='male'. Example 3: (var1 !=10 & var2>20) | var3==40. Example 4: (grepl(\"xxx\",var1) ==TRUE) | var1==\"abc\". Example 5: substr(var1,2,4) ==\"abc\"",
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








class removeNAs extends baseModal {
    constructor() {
        var config = {
            id: "removeNAs",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(data.table)
#Removes missing values
#{{selected.newdatasetname | safe}}{{selected.rd | safe}}<-data.table:::na.omit.data.table({{dataset.name}}[c({{selected.subsetvars | safe}})])
{{selected.newdatasetname | safe}}{{selected.rd | safe}}<-na.omit({{dataset.name}}[c({{selected.subsetvars | safe}})])
#Refreshes the dataset in the data grid
BSkyLoadRefresh("{{selected.newdatasetname | safe}}{{selected.rd | safe}}")
 `
        }
        var objects = {
            label0: { el: new labelVar(config, { label: localization.en.label0, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            label1: { el: new labelVar(config, { label: localization.en.label1,style: "mt-2",h: 5 }) },
            New: { el: new radioButton(config, { label: localization.en.New, no: "rd", increment: "New", value: "", state: "checked", extraction: "ValueAsIs",required: true, dependant_objects: ['newdatasetname'] }) },
            newdatasetname: {
                el: new input(config, {
                    no: 'newdatasetname',
                    label: localization.en.newdatasetname,
                    placeholder: "",
                    extraction: "TextAsIs",
                    overwrite: "dataset",
                    ml: 4,
                    type: "character"
                })
            },
            Existing: { el: new radioButton(config, { label: localization.en.Existing, no: "rd", increment: "Existing", style: "mb-2",syntax: "{{dataset.name}}", value: "", state: "", extraction: "ValueAsIs" }) },
            subsetvars: {
                el: new dstVariableList(config, {
                    label: localization.en.subsetvars,
                    no: "subsetvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
        }
        const content = {
            head: [objects.label0.el.content,],
            left: [objects.content_var.el.content],
            right: [objects.label1.el.content, objects.New.el.content, objects.newdatasetname.el.content, objects.Existing.el.content, objects.subsetvars.el.content,],
            nav: {
                name: localization.en.navigation,
                icon: "icon-na",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new removeNAs().render()