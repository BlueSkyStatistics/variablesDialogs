
var localization = {
    en: {
        title: "Add New Levels",
        navigation: "Add",
        target: "Factor variables to add new levels to",
        label1: "Add new levels to one or more factor variable(s). Save results to existing variables or create new variables by specifying a prefix/suffix. New variables will be created with the prefix/suffix appended to existing names. ",
        newLevels: "Enter new levels enclosed in quotes and separated by a comma for e.g. \"level1\",\"level2\",\"level3",
        label2: "Save new levels to new variable(s) or overwrite existing variable(s)",
        rd3: "Specify a suffix (A new variable will be created with the suffix) ",
        txt3: "Enter a suffix",
        rd2: "Specify a prefix (A new variable will be created with the prefix) ",
        txt4: "Enter a prefix",
        rd1: "Overwrite  existing variables",
        help: {
            title: "Add New Levels",
            r_help: "help(fct_expand, package=\"forcats\")",
            body: `
<b>NOTE: DON'T ENCLOSE LEVELS IN DOUBLE QUOTES OR SINGLE QUOTES, THERE CANNOT BE SPACES IN THE LEVEL NAMES. ENTER LEVELS SEPARATED BY COMMAS IN THE FORMAT LEVEL1,LEVEL2, LEVEL3</b></br>
<b>Description</b></br>
Add additional levels to a factor. Add new levels to one or more factor variable(s). The results can be into existing variables (overwriting) or creating new variables by specifying a prefix/suffix. New variables will be created with the prefix/suffix appended to existing names. 
<br/>
<b>Usage</b>
<br/>
<code> 
fct_expand(f, ...)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
f: A factor (or character vector).
</li>
<li>
...: Additional levels to add to the factor. Levels that already exist will be silently ignored.
</li>
</ul>
<b>Examples</b><br/>
<code> 
f <- factor(sample(letters[1:3], 20, replace = TRUE))<br/>
f<br/>
fct_expand(f, "d", "e", "f")<br/>
fct_expand(f, letters[1:6])<br/>
</code><br/>
<b>Package</b></br>
forcats</br>
<b>Help</b></br>
help(fct_expand, package="forcats")
        `}
    }
}








class addNewLevels extends baseModal {
    constructor() {
        var config = {
            id: "addNewLevels",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(forcats);
{{ if ( options.selected.grp10 =="Overwrite"  ) }}
{{dataset.name}}\${{selected.target[0] | safe}} <- forcats::fct_expand({{dataset.name}}\${{selected.target[0] | safe}},{{selected.newLevels | safe}}){{/if}}
{{ if ( options.selected.grp10 =="Prefix"  ) }}
{{dataset.name}}\${{selected.txt4 | safe}}_{{selected.target[0] | safe}} <- forcats::fct_expand({{dataset.name}}\${{selected.target[0] | safe}},{{selected.newLevels | safe}}){{/if}}
{{ if ( options.selected.grp10 =="Suffix" ) }}
{{dataset.name}}\${{selected.target[0] | safe}}_{{selected.txt3 | safe}} <- forcats::fct_expand({{dataset.name}}\${{selected.target[0] | safe}},{{selected.newLevels | safe}}){{/if}}
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
                    extraction: "CreateArray",
                    value: "",
                    allow_spaces:true,
                    ml: 4,
                    required: true,
                    type: "character",
                }),
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, h: 6, style: "mt-3" }) },
            rd3: { el: new radioButton(config, { label: localization.en.rd3, required: true, no: "grp10", dependant_objects: ["txt3"], increment: "rd3", value: "Suffix", state: "checked", extraction: "ValueAsIs", dependant_objects: ["txt3"] }) },
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
            rd2: { el: new radioButton(config, { label: localization.en.rd2, required: true, no: "grp10", increment: "rd2", dependant_objects: ["txt4"], value: "Prefix", state: "", extraction: "ValueAsIs", dependant_objects: ["txt4"] }) },
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
            rd1: { el: new radioButton(config, { label: localization.en.rd1, no: "grp10", required: true, increment: "rd1", value: "Overwrite", state: "", extraction: "ValueAsIs" }) },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.newLevels.el.content, objects.label2.el.content, objects.rd3.el.content, objects.txt3.el.content, objects.rd2.el.content, objects.txt4.el.content, objects.rd1.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-plus_sign",
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
                    grp10: common.getCheckedRadio("addNewLevels_grp10"),
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
module.exports.item = new addNewLevels().render()