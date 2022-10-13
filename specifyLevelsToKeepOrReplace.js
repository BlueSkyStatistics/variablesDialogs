
var localization = {
    en: {
        title: "Specify levels to keep or replace by other",
        navigation: "Lump into Other (Manually)",
        target: "Factor variables to reorder",
        label1: "Enter the factor levels to keep or replace by other. When levels to keep is selected, remaining levels will be replaced by \"Other\". When replace is selected, specified levels will be replaced by \"Other\"",
        other: "Level name used for \"Other\" values",
        label3: "Method to use",
        keep: "Keep levels",
        drop: "Drop levels",
        keepOption: "Enter levels to keep separated by , remaining levels will be replaced by \"Other\" for e.g. level1,level2,level3",
        dropOption: "Enter levels to replace by \"Other\" for e.g. level1,level2,level3",
        label2: "Save results to new variable(s) or overwrite existing variable(s)",
        rd3: "Specify a suffix (A new variable will be created with the suffix) ",
        txt3: "Enter a suffix",
        rd2: "Specify a prefix (A new variable will be created with the prefix) ",
        txt4: "Enter a prefix",
        rd1: "Overwrite  existing variables",
        help: {
            title: "Levels to keep or replace",
            r_help: "help(fct_other, package =forcats)",
            body: `
<b>NOTE: DON'T ENCLOSE LEVELS IN DOUBLE QUOTES OR SINGLE QUOTES, THERE CANNOT BE SPACES IN THE LEVEL NAMES. ENTER LEVELS SEPARATED BY COMMAS IN THE FORMAT LEVEL1,LEVEL2, LEVEL3</b><br/>
<b>Description</b></br>
Enter the factor levels to keep or drop. When keep is selected, remaining levels will be replaced by "Other". When drop is selected, dropped levels will be replaced by "Other"
<br/>
<b>Usage</b>
<br/>
<code> 
fct_other(f, keep, drop, other_level = "Other")
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
f :A factor (or character vector).
</li>
<li>
keep, drop: keep will preserve listed levels, replacing all others with other_level. drop will replace listed levels with other_level, keeping all others as they are.
</li>
<li>
other_level: Value of level used for "other" values. Always placed at end of levels.
</li>
</ul>
<b>Examples</b></br>
<code>
x <- factor(rep(LETTERS[1:9], times = c(40, 10, 5, 27, 1, 1, 1, 1, 1)))<br/>
fct_other(x, keep = c("A", "B"))<br/>
fct_other(x, drop = c("A", "B"))<br/>
</code> <br/>
<b>Package</b></br>
forcats</br>
<b>Help</b></br>
help(fct_other, package =forcats)
    `}
    }
}








class specifyLevelsToKeepOrReplace extends baseModal {
    constructor() {
        var config = {
            id: "specifyLevelsToKeepOrReplace",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
## [Specify levels to keep or replace]
require(forcats);
{{ if ( options.selected.grp10 =="Overwrite" && options.selected.method =="keepOption" ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_other(f={{dataset.name}}\${{selected.target[0] | safe}}, keep=c({{selected.keep | safe}}), other_level="{{selected.other | safe}}"){{/if}}
{{ if ( options.selected.grp10 =="Overwrite" && options.selected.method =="dropOption" ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_other(f={{dataset.name}}\${{selected.target[0] | safe}}, drop=c({{selected.drop | safe}}), other_level="{{selected.other | safe}}"){{/if}}
{{ if ( options.selected.grp10 =="Prefix" && options.selected.method =="keepOption"  ) }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_other(f={{dataset.name}}\${{selected.target[0] | safe}}, keep=c({{selected.keep | safe}}), other_level="{{selected.other | safe}}"){{/if}}
{{ if ( options.selected.grp10 =="Prefix" && options.selected.method =="dropOption") }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_other(f={{dataset.name}}\${{selected.target[0] | safe}}, drop=c({{selected.drop | safe}}), other_level="{{selected.other | safe}}"){{/if}}
{{ if ( options.selected.grp10 =="Suffix" && options.selected.method =="keepOption"  ) }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_other(f={{dataset.name}}\${{selected.target[0] | safe}}, keep=c({{selected.keep | safe}}), other_level="{{selected.other | safe}}"){{/if}}
{{ if ( options.selected.grp10 =="Suffix" && options.selected.method =="dropOption") }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_other(f={{dataset.name}}\${{selected.target[0] | safe}}, drop=c({{selected.drop | safe}}), other_level="{{selected.other | safe}}"){{/if}}
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
            other: {
                el: new input(config, {
                    no: 'other',
                    label: localization.en.other,
                    placeholder: "",
                    allow_spaces:true,
                    extraction: "TextAsIs",
                    value: "",
                    required: true,
                    type: "character",
                }),
            },
            label3: { el: new labelVar(config, { label: localization.en.label3,style: "mt-3",h: 5 }) },
            keepOption: { el: new radioButton(config, { label: localization.en.keepOption, no: "method", required: true, increment: "keepOption", value: "keepOption", state: "checked", extraction: "ValueAsIs", dependant_objects: ["keep"] }) },
            keep: {
                el: new input(config, {
                    no: 'keep',
                    label: localization.en.keep,
                    placeholder: "",
                    allow_spaces:true,
                    extraction: "TextAsIs",
                    value: "",
                    ml: 4,
                    type: "character",
                }),
            },
            dropOption: { el: new radioButton(config, { label: localization.en.dropOption, no: "method", required: true, increment: "dropOption", value: "dropOption", state: "", extraction: "ValueAsIs", dependant_objects: ["drop"] }) },
            drop: {
                el: new input(config, {
                    no: 'drop',
                    label: localization.en.drop,
                    placeholder: "",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    value: "",
                    ml: 4,
                    type: "character",
                }),
            },
            label2: { el: new labelVar(config, { label: localization.en.label2,style: "mt-3",h: 5}) },
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
            right: [objects.target.el.content, objects.other.el.content, objects.label3.el.content, objects.keepOption.el.content, objects.keep.el.content, objects.dropOption.el.content, objects.drop.el.content, objects.label2.el.content, objects.rd3.el.content, objects.txt3.el.content, objects.rd2.el.content, objects.txt4.el.content, objects.rd1.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-hand_pointing",
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
                    grp10: common.getCheckedRadio("specifyLevelsToKeepOrReplace_grp10"),
                    method: common.getCheckedRadio("specifyLevelsToKeepOrReplace_method"),
                    keep: instance.objects.keep.el.getVal(),
                    drop: instance.objects.drop.el.getVal(),
                    other: instance.objects.other.el.getVal(),
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
module.exports.item = new specifyLevelsToKeepOrReplace().render()