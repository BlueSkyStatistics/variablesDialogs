
var localization = {
    en: {
        title: "Reorder Factor Levels by Occurrence",
        navigation: "Reorder by Occurrence",
        target: "Factor variables to re-order levels",
        label1: "Select the factor variables to reorder by occurrence of data in the variable. You can overwrite existing variables or create new variables by specifying a prefix/suffix. New variables will be created with the prefix/suffix appended to existing names.",
        label2: "Save new levels to new variable(s) or overwrite existing variable(s)",
        rd3: "Specify a suffix (A new variable will be created with the suffix) ",
        txt3: "Enter a suffix",
        rd2: "Specify a prefix (A new variable will be created with the prefix) ",
        txt4: "Enter a prefix",
        rd1: "Overwrite  existing variables",
        label3: "Specify an order",
        Descending: "In the order of occurrence",
        Ascending: "In the reverse order of occurrence",
        ordered: "Make an ordered factor (ordinal)",
        help: {
            title: "Remove NAs",
            r_help: "help(fct_inorder, package=forcats)",
            body: `
<b>Description</b></br>
Reorder factors levels by first appearance (occurence). See reorder by count for ordering by count/frequency.
<br/>
<b>Usage</b>
<br/>
<code> 
fct_inorder(f, ordered = NA)</br>
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
f: A factor
</li>
<li>
ordered: A logical which determines the "ordered" status of the output factor. NA preserves the existing status of the factor.
</li>
</ul>
<b>Examples</b>
<code></br>
f <- factor(c("b", "b", "a", "c", "c", "c"))</br>
f</br>
fct_inorder(f)</br>
fct_infreq(f)</br>
fct_inorder(f, ordered = TRUE)</br>
f <- factor(sample(1:10))</br>
fct_inseq(f)</br>
</code>
`}
    }
}








class reorderByOccurance extends baseModal {
    constructor() {
        var config = {
            id: "reorderByOccurance",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
## [Reorder by Occurrence]
require(forcats);
{{ if ( options.selected.grp10 =="Overwrite" && options.selected.specifyOrder =="Ascending" ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_rev(forcats::fct_inorder({{dataset.name}}\${{selected.target[0] | safe}},ordered={{selected.ordered | safe}})){{/if}}
{{ if ( options.selected.grp10 =="Overwrite" && options.selected.specifyOrder =="Descending" ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_inorder({{dataset.name}}\${{selected.target[0] | safe}},ordered={{selected.ordered | safe}}){{/if}}
{{ if ( options.selected.grp10 =="Prefix" && options.selected.specifyOrder =="Ascending" ) }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_rev(forcats::fct_inorder({{dataset.name}}\${{selected.target[0] | safe}},ordered={{selected.ordered | safe}})){{/if}}
{{ if ( options.selected.grp10 =="Prefix" && options.selected.specifyOrder =="Descending") }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_inorder({{dataset.name}}\${{selected.target[0] | safe}},ordered=TRUE){{/if}}
{{ if ( options.selected.grp10 =="Suffix" && options.selected.specifyOrder =="Ascending" ) }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_rev(forcats::fct_inorder({{dataset.name}}\${{selected.target[0] | safe}},ordered={{selected.ordered | safe}})){{/if}}
{{ if ( options.selected.grp10 =="Suffix" && options.selected.specifyOrder =="Descending") }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_inorder({{dataset.name}}\${{selected.target[0] | safe}},ordered={{selected.ordered | safe}}){{/if}}
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
            rd2: { el: new radioButton(config, { label: localization.en.rd2, no: "grp10", increment: "rd2", required: true, dependant_objects: ["txt4"], value: "Prefix", state: "", extraction: "ValueAsIs", }) },
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
            label3: { el: new labelVar(config, { label: localization.en.label3, style: "mt-3",h: 5}) },
            Descending: { el: new radioButton(config, { label: localization.en.Descending, no: "specifyOrder", increment: "Descending", value: "Descending", state: "checked", extraction: "ValueAsIs", }) },
            Ascending: { el: new radioButton(config, { label: localization.en.Ascending, no: "specifyOrder", increment: "Ascending", value: "Ascending", state: "", extraction: "ValueAsIs", }) },
            ordered: { el: new checkbox(config, { label: localization.en.ordered, style: "mt-4",no: "ordered", extraction: "Boolean" }) },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.label3.el.content, objects.Descending.el.content, objects.Ascending.el.content, objects.ordered.el.content, objects.label2.el.content, objects.rd3.el.content, objects.txt3.el.content, objects.rd2.el.content, objects.txt4.el.content, objects.rd1.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-rank",
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
                    txt4: instance.objects.txt4.el.getVal(),
                    ordered: instance.objects.ordered.el.getVal() == true ? "TRUE" : "NA",
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
module.exports.item = new reorderByOccurance().render()