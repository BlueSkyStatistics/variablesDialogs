
var localization = {
    en: {
        title: "Concatenate Variables",
        navigation: "Concatenate",
        newvar: "Enter new/existing variable for concatenated results",
        concatenate: "Select the variables to concatenate",
        repString: "Enter an optional separator for the concatenated variables",
        help: {
            title: "Concatenate Variables",
            r_help: "help(binVariable,package='RcmdrMisc')",
            body: `
<b>Description</b></br>
Create a factor dissecting the range of a numeric variable into bins of equal width, (roughly) equal frequency, or at "natural" cut points (determined by K-means clustering)
<br/>
<b>Usage</b>
<br/>
<code> 
bin.var(x, bins = 4, method = c("intervals", "proportions", "natural"),labels = FALSE)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
X: numeric variable to be binned.
</li>
<li>
Bins: number of bins.
</li>
<li>
method: one of "intervals" for equal-width bins; "proportions" for equal-count bins; "natural" for cut points between bins to be determined by  k-means clustering.
</li>
<li>
Labels: if FALSE, numeric labels will be used for the factor levels; if NULL, the cut points are used to define labels; otherwise a character vector of level names.
</li>
</ul>
<b>Package</b></br>
RcmdrMisc</br>
<b>Help</b></br>
help(binVariable,package='RcmdrMisc')
`}
    }
}









class concatenateVariables extends baseModal {
    constructor() {
        var config = {
            id: "concatenateVariables",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
{{if (options.selected.repString =="")}}.GlobalEnv\${{dataset.name}}\${{selected.newvar | safe}} <- with({{dataset.name}}, BSkyPaste5 ({{selected.concatenate | safe}}, sep="", collapse = NULL, na.rm = T) )
{{#else}}.GlobalEnv\${{dataset.name}}\${{selected.newvar | safe}} <- with({{dataset.name}}, BSkyPaste5 ({{selected.concatenate | safe}}, sep = "{{selected.repString | safe}}", collapse = NULL, na.rm = T) )\n{{/if}}
BSkyLoadRefresh("{{dataset.name}}")
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            newvar: {
                el: new input(config, {
                    no: 'newvar',
                    label: localization.en.newvar,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    overwrite: "variable",
                    required: true,
                    type: "character"
                })
            },
            concatenate: {
                el: new dstVariableList(config, {
                    label: localization.en.concatenate,
                    no: "concatenate",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            repString: {
                el: new input(config, {
                    no: 'repString',
                    label: localization.en.repString,
                    placeholder: "",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    value: ""
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.newvar.el.content, objects.concatenate.el.content, objects.repString.el.content,],
            nav: {
                name: localization.en.navigation,
                icon: "icon-concatenate_values",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new concatenateVariables().render()