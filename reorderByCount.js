
var localization = {
    en: {
        title: "Reorder Factor Levels by Count",
        navigation: "Reorder by Count",
        target: "Select factor variables to re-order",
        label1: "Select the factor variables to reorder by count. You can overwrite existing variables or create new variables by specifying a prefix/suffix. New variables will be created with the prefix/suffix appended to existing names.",
        label2: "Save new levels to new variable(s) or overwrite existing variable(s)",
        rd3: "Specify a suffix (A new variable will be created with the suffix) ",
        txt3: "Enter a suffix",
        rd2: "Specify a prefix (A new variable will be created with the prefix) ",
        txt4: "Enter a prefix",
        rd1: "Overwrite  existing variables",
        label3: "Specify an order",
        Descending: "In the descending order by count",
        Ascending: "In the ascending order by count",
        ordered: "Make an ordered factor (ordinal)",
        help: {
            title: "Reorder Variables Alphabetically",
            r_help: "help(sort)",
            body: `
<b>Description</b></br>
Re-order variables in the dataset in alphabetical order. We use the sort function to sort the names of the columns/variables in the dataset and the select function in the package dplyr to select the column names in the correct alphabetical order 
<br/>
<b>Usage</b>
<br/>
<code> 
##Reordering alphabetically (A-Z)
Dataset_name <- Dataset_name %>%   select(sort(names(.)))
##Reordering alphabetically (Z-A)
Dataset_name <- Dataset_name %>%  select(rev(sort(names(.))))
</code> <br/>
<b>Arguments</b><br/>
None<br/>
<b>Package</b></br>
dplyr</br>
<b>Help</b></br>
help(select, package='dplyr')<br/>
help(sort)
`}
    }
}








class reorderByCount extends baseModal {
    constructor() {
        var config = {
            id: "reorderByCount",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
## [Reorder by Count]
require(forcats);
{{ if ( options.selected.grp10 =="Overwrite" && options.selected.specifyOrder =="Ascending" ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_rev(forcats::fct_infreq({{dataset.name}}\${{selected.target[0] | safe}},ordered={{selected.ordered | safe}})){{/if}}
{{ if ( options.selected.grp10 =="Overwrite" && options.selected.specifyOrder =="Descending" ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_infreq({{dataset.name}}\${{selected.target[0] | safe}},ordered={{selected.ordered | safe}}){{/if}}
{{ if ( options.selected.grp10 =="Prefix" && options.selected.specifyOrder =="Ascending" ) }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_rev(forcats::fct_infreq({{dataset.name}}\${{selected.target[0] | safe}},ordered={{selected.ordered | safe}})){{/if}}
{{ if ( options.selected.grp10 =="Prefix" && options.selected.specifyOrder =="Descending") }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_infreq({{dataset.name}}\${{selected.target[0] | safe}},ordered=TRUE){{/if}}
{{ if ( options.selected.grp10 =="Suffix" && options.selected.specifyOrder =="Ascending" ) }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_rev(forcats::fct_infreq({{dataset.name}}\${{selected.target[0] | safe}},ordered={{selected.ordered | safe}})){{/if}}
{{ if ( options.selected.grp10 =="Suffix" && options.selected.specifyOrder =="Descending") }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_infreq({{dataset.name}}\${{selected.target[0] | safe}},ordered={{selected.ordered | safe}}){{/if}}
\nBSkyLoadRefresh("{{dataset.name}}")
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) },
            target: {
                el: new dstVariableList(config, {
                    label: localization.en.target,
                    no: "target",
                    filter: "Numeric|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ target | safe}}']
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, style: "mt-3",h: 5 }) },
            rd3: { el: new radioButton(config, { label: localization.en.rd3, no: "grp10", increment: "rd3", required: true, dependant_objects: ["txt3"], value: "Suffix", state: "checked", extraction: "ValueAsIs", }) },
            txt3: {
                el: new input(config, {
                    no: 'txt3',
                    label: localization.en.txt3,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    ml: 4,
                    type: "character"
                }),
            },
            rd2: { el: new radioButton(config, { label: localization.en.rd2, no: "grp10", increment: "rd2", required: true, value: "Prefix", dependant_objects: ["txt4"], state: "", extraction: "ValueAsIs", }) },
            txt4: {
                el: new input(config, {
                    no: 'txt4',
                    label: localization.en.txt4,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    ml: 4,
                    type: "character"
                }),
            },
            rd1: { el: new radioButton(config, { label: localization.en.rd1, no: "grp10", increment: "rd1", value: "Overwrite", state: "", extraction: "ValueAsIs" }) },
            label3: { el: new labelVar(config, { label: localization.en.label3,style: "mt-3",h: 5 }) },
            Descending: { el: new radioButton(config, { label: localization.en.Descending, no: "specifyOrder", increment: "Descending", value: "Descending", state: "checked", extraction: "ValueAsIs", }) },
            Ascending: { el: new radioButton(config, { label: localization.en.Ascending, no: "specifyOrder", increment: "Ascending", value: "Ascending", state: "", extraction: "ValueAsIs", }) },
            ordered: {
                el: new checkbox(config, {
                    label: localization.en.ordered, no: "ordered",
                    extraction: "BooleanValue",
                    bs_type: "valuebox",
                    true_value: "TRUE",
                    false_value: "NA",
                    style: "mt-4",
                    extraction: "Boolean"
                })
            },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.label3.el.content, objects.Descending.el.content, objects.Ascending.el.content, objects.ordered.el.content, objects.label2.el.content, objects.rd3.el.content, objects.txt3.el.content, objects.rd2.el.content, objects.txt4.el.content, objects.rd1.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-reorder_by_count",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
    prepareExecution(instance) {
        var res = [];
        var temp = "";
        instance.objects.target.el.getVal().forEach(function (value) {
            var code_vars = {
                dataset: {
                    name: getActiveDataset()
                },
                selected: {
                    target: instance.dialog.prepareSelected({ target: value }, instance.objects.target.r),
                    grp10: common.getCheckedRadio("reorderByCount_grp10"),
                    specifyOrder: common.getCheckedRadio("reorderByCount_specifyOrder"),
                    txt3: instance.objects.txt3.el.getVal(),
                    ordered: instance.objects.ordered.el.getVal() == true ? "TRUE" : "NA",
                    txt4: instance.objects.txt4.el.getVal(),
                }
            }
            let cmd = instance.dialog.renderR(code_vars)
            cmd = removenewline(cmd);
            temp = temp + cmd + "\n";
        })
        res.push({ cmd: temp, cgid: newCommandGroup() })
        return res;
    }
}
module.exports.item = new reorderByCount().render()