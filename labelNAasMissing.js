
var localization = {
    en: {
        title: "Specify a label for NAs",
        navigation: "Label NAs",
        target: "Factor variables to label NA values ",
        label1: "Enter a label for the \"NA\" level for factor variable(s). New label can be saved to existing variable(s) or new variables by specifying a prefix/suffix. New variables will be created with the prefix/suffix appended to existing names. ",
        newLevels: "Enter a label for the \"NA\" level",
        label2: "Create new or overwrite existing variables",
        rd3: "Specify a suffix (A new variable will be created with the suffix) ",
        txt3: "Enter a suffix",
        rd2: "Specify a prefix (A new variable will be created with the prefix) ",
        txt4: "Enter a prefix",
        rd1: "Overwrite  existing variables",
        help: {
            title: "Remove NAs",
            r_help: "help(fct_explicit_na, package =forcats)",
            body: `
<b>Description</b></br>
Enter a label for the "NA" level for factor variable(s). New label can be saved to existing variable(s) (we overwrite existing variables) or new label for NA can be saved to new variables by specifying a prefix/suffix. New variables will be created with the prefix/suffix appended to existing names. 
This gives missing value an explicit factor level, ensuring that they appear in summaries and on plots.
<br/>
<b>Usage</b>
<br/>
<code> 
fct_explicit_na(f, na_level = "(Missing)")
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
f :A factor (or character vector).
</li>
<li>
na_level :Level to use for missing values.
</li>
</ul>
<b>Examples</b></br>
<code> 
f1 <- factor(c("a", "a", NA, NA, "a", "b", NA, "c", "a", "c", "b"))<br/>
table(f1)<br/>
f2 <- fct_explicit_na(f1)<br/>
table(f2)<br/>
</code> <br/>
<b>Package</b></br>
forcats</br>
<b>Help</b></br>
Type the line below in the BlueSky Statistics  R syntax editor</br>
help(fct_explicit_na, package =forcats)
`}
    }
}








class labelNAasMissing extends baseModal {
    constructor() {
        var config = {
            id: "labelNAasMissing",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
## [Specify a label for NA values]
require(forcats);
{{ if ( options.selected.grp10 =="Overwrite"  ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_explicit_na( f={{dataset.name}}\${{selected.target[0] | safe}} {{if (options.selected.newLevels != "")}}, na_level=c("{{selected.newLevels | safe}}"){{/if}}){{/if}}
{{ if ( options.selected.grp10 =="Prefix"  ) }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_explicit_na(f={{dataset.name}}\${{selected.target[0] | safe}}{{if (options.selected.newLevels != "")}},na_level=c("{{selected.newLevels | safe}}"){{/if}}){{/if}}
{{ if ( options.selected.grp10 =="Suffix" ) }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_explicit_na(f={{dataset.name}}\${{selected.target[0] | safe}}{{if (options.selected.newLevels != "")}}, na_level=c("{{selected.newLevels | safe}}"){{/if}}){{/if}}
\nBSkyLoadRefresh("{{dataset.name}}")
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            target: {
                el: new dstVariableList(config, {
                    label: localization.en.target,
                    no: "target",
                    filter: "Numeric|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ target | safe}}']
            },
            newLevels: {
                el: new input(config, {
                    no: 'newLevels',
                    label: localization.en.newLevels,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    ml: 4,
                    allow_spaces:true,
                    required: true,
                    type: "character",
                }),
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, h: 5, style: "mt-3" }) },
            rd3: { el: new radioButton(config, { label: localization.en.rd3, no: "grp10", required: true, dependant_objects: ["txt3"], increment: "rd3", value: "Suffix", state: "checked", extraction: "ValueAsIs", }) },
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
            rd2: { el: new radioButton(config, { label: localization.en.rd2, no: "grp10", required: true, dependant_objects: ["txt4"], increment: "rd2", value: "Prefix", state: "", extraction: "ValueAsIs", }) },
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
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.newLevels.el.content, objects.label2.el.content, objects.rd3.el.content, objects.txt3.el.content, objects.rd2.el.content, objects.txt4.el.content, objects.rd1.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-na",
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
                    grp10: common.getCheckedRadio("labelNAasMissing_grp10"),
                    newLevels: instance.objects.newLevels.el.getVal(),
                    txt3: instance.objects.txt3.el.getVal(),
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
module.exports.item = new labelNAasMissing().render()