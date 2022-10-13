
var localization = {
    en: {
        title: "Replace Misssing values (Numeric variables)",
        navigation: "Numeric",
        label1: "Missing values (NAs) in the variables selected are replaced by applying a function  i.e. median, mean, min, max or the value specified.",
        target: "Select Variables to Replace Missing Values for",
        label2: "Select a function or specify a value to replace NAs",
        rd1: "Use a function to compute missing values",
        selectctrl: "Select the function",
        rd2: "Specify a numeric value to replace missing values",
        valueEntered: "Enter a numeric value",
        help: {
            title: "Replace Missing values (Numeric)",
            r_help: "help(mean)",
            body: `
<b>Description</b></br>
Replace missing values in variables selected by the operation selected i.e. median, mean, min, max
<br/>
<b>Usage</b>
<br/>
<code> 
Dataset[is.na(Dataset2[,var]),var]<-median(Dataset[,var],na.rm=TRUE)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
var: Character string representing the numeric variable with missing values (na), for e.g. var = c('sales')
</li>
<li>
Dataset: The dataset that contains the variable var
</li>
</ul>
<b>Value</b><br/>
Computed values are stored directly in Dataset<br/>
<b>Package</b></br>
base</br>
<b>Help</b></br>
help(mean)`}
    }
}










class missingValuesBasic extends baseModal {
    constructor() {
        var config = {
            id: "missingValuesBasic",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
local({
    varNames =c({{selected.target | safe}})
    operation = c('{{selected.grp | safe}}')
    if (operation =="applyOperation")
    {
    #Replaces the nas in each variable by the mean, median, min or max
    for(var in varNames)
    {
    {{dataset.name}}[is.na({{dataset.name}}[, var]), var]<<-{{selected.selectctrl | safe}}({{dataset.name}}[,var],na.rm=TRUE)
    }
    }
    #Replaces nas by specified value
    if (operation == "replaceValue")
    {
    {{dataset.name}}[,varNames]  [is.na({{dataset.name}}[,varNames])] <<-c( {{selected.valueEntered | safe}})
    }
})
#Refreshes the datast in the data grid
BSkyLoadRefresh("{{dataset.name}}")
            `
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
            label2: { el: new labelVar(config, { label: localization.en.label2, style: "mt-3",h: 5 }) },
            rd1: { el: new radioButton(config, { label: localization.en.rd1, no: "grp", increment: "rd1", required: true, value: "applyOperation", state: "checked", extraction: "ValueAsIs", dependant_objects: ["selectctrl"] }) },
            selectctrl: {
                el: new comboBox(config, {
                    no: 'selectctrl',
                    label: localization.en.selectctrl,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    default: "mean",
                    options: ["mean", "median", "min", "max", "getmode"]
                })
            },
            rd2: { el: new radioButton(config, { label: localization.en.rd2, no: "grp", increment: "rd2", value: "replaceValue", required: true, state: "", extraction: "ValueAsIs", dependant_objects: ["valueEntered"] }) },
            valueEntered: {
                el: new inputSpinner(config, {
                    no: 'valueEntered',
                    label: localization.en.valueEntered,
                    min: -9999999,
                    max: 9999999,
                    step: 1,
                    value: 0,
                    extraction: "NoPrefix|UseComma"
                })
            },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.label2.el.content, objects.rd1.el.content, objects.selectctrl.el.content, objects.rd2.el.content, objects.valueEntered.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-123",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new missingValuesBasic().render()