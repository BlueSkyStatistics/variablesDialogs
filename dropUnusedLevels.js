
var localization = {
    en: {
        title: "Drop Unused Levels",
        navigation: "Drop Unused",
        target: "Factor variables to drop levels for",
        label1: "Enter the factor variables to drop levels for.  You can specify unused levels to drop by entering them or select to drop all unused levels for the variable(s) selected.  If the dataset variable has a NA value(s) in the data, then that level is NOT dropped.",
        label2: "Save new levels to new variable(s) or overwrite existing variable(s)",
        rd3: "Specify a suffix (A new variable will be created with the suffix) ",
        txt3: "Enter a suffix",
        rd2: "Specify a prefix (A new variable will be created with the prefix) ",
        txt4: "Enter a prefix",
        rd1: "Overwrite  existing variables",
        label3: "Method to use",
        dropUnused: "Drop all unused levels ",
        levelsToDrop: "Specify levels to drop ",
        drop: "Enter levels to drop separated by comma, for e.g. level1,level2,level3 NOTE: Don't use spaces as separators between the levels",
        help: {
            title: "Drop Unused Levels",
            r_help: "help(fct_drop, package =forcats)",
            body: `
<b>NOTE: DON'T ENCLOSE LEVELS IN DOUBLE QUOTES OR SINGLE QUOTES, THERE CANNOT BE SPACES IN THE LEVEL NAMES. ENTER LEVELS SEPARATED BY COMMAS IN THE FORMAT LEVEL1,LEVEL2, LEVEL3</b></br>
<b>Description</b></br>
Enter the factor variable(s) to drop unused levels for.  You can specify unused levels to drop by entering them or select to drop all unused levels for the variable(s) selected.  If the dataset variable has a NA value(s) in the data, then that level is NOT dropped.
<br/>
<b>Usage</b>
<br/>
<code> 
fct_drop(f, only)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
f: A factor (or character vector).
</li>
<li>
only: A character vector restricting the set of levels to be dropped. If supplied, only levels that have no entries and appear in this vector will be removed.
</li>
</ul>
<b>Examples</b><br/>
</code>
f <- factor(c("a", "b"), levels = c("a", "b", "c"))<br/>
f<br/>
fct_drop(f)<br/>
# Set only to restrict which levels to drop<br/>
fct_drop(f, only = "a")<br/>
fct_drop(f, only = "c")<br/>
<b>Package</b></br>
forcats</br>
<b>Help</b></br>
help(fct_drop, package =forcats)
`}
    }
}








class dropUnusedLevels extends baseModal {
    constructor() {
        var config = {
            id: "dropUnusedLevels",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
## [Reorder by Count]
require(forcats);
{{ if ( options.selected.grp10 =="Overwrite"  ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_drop( f={{dataset.name}}\${{selected.target[0] | safe}} {{if (options.selected.drop != "")}}, only=c({{selected.drop | safe}}){{/if}}){{/if}}
{{ if ( options.selected.grp10 =="Prefix"  ) }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_drop(f={{dataset.name}}\${{selected.target[0] | safe}}{{if (options.selected.drop != "")}},only=c({{selected.drop | safe}}){{/if}}){{/if}}
{{ if ( options.selected.grp10 =="Suffix" ) }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_drop(f={{dataset.name}}\${{selected.target[0] | safe}}{{if (options.selected.drop != "")}}, only=c({{selected.drop | safe}}){{/if}}){{/if}}
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
                    filter: "Numeric|Logical|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ target | safe}}']
            },
            label3: { el: new labelVar(config, { label: localization.en.label3, h: 5, style: "mt-2" }) },
            dropUnused: { el: new radioButton(config, { label: localization.en.dropUnused, no: "method", increment: "dropUnused", value: "TRUE", state: "checked", extraction: "ValueAsIs", }) },
            levelsToDrop: { el: new radioButton(config, { label: localization.en.levelsToDrop, no: "method", required: true, dependant_objects: ["drop"], increment: "levelsToDrop", value: "FALSE", state: "", extraction: "ValueAsIs", }) },
            drop: {
                el: new input(config, {
                    no: 'drop',
                    label: localization.en.drop,
                    placeholder: "",
                    extraction: "TextAsIs",
                    ml: 4,
                    allow_spaces:true,
                    type: "character",
                }),
            },
            label2: { el: new labelVar(config, { label: localization.en.label2,h: 5, style: "mt-2" }) },
            rd3: { el: new radioButton(config, { label: localization.en.rd3, no: "grp10", increment: "rd3", required: true, dependant_objects: ["txt3"], value: "Suffix", state: "checked", extraction: "ValueAsIs", }) },
            txt3: {
                el: new input(config, {
                    no: 'txt3',
                    label: localization.en.txt3,
                    placeholder: "",
                    extraction: "TextAsIs",
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
                    ml: 4,
                    type: "character"
                }),
            },
            rd1: { el: new radioButton(config, { label: localization.en.rd1, no: "grp10", increment: "rd1", value: "Overwrite", state: "", extraction: "ValueAsIs" }) },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.label3.el.content, objects.dropUnused.el.content, objects.levelsToDrop.el.content, objects.drop.el.content, objects.label2.el.content, objects.rd3.el.content, objects.txt3.el.content, objects.rd2.el.content, objects.txt4.el.content, objects.rd1.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-trash",
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
                    grp10: common.getCheckedRadio("dropUnusedLevels_grp10"),
                    drop: instance.objects.drop.el.getVal(),
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
module.exports.item = new dropUnusedLevels().render()