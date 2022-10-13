
var localization = {
    en: {
        title: "Binning",
        navigation: "Bin",
        vartobin: "Select a variable to bin",
        varname: "Enter a variable name to save the binned value",
        noofbins: "Specify the number of bins",
        label1: "Level names",
        Names: "Specify names",
        levelnames: "Enter level names separated by comma (,), e.g. good,better,best",
        Numbers: "Numbers",
        Ranges: "Ranges",
        label2: "Binning method",
        equalwidth: "Equal width bins",
        equalcount: "Equal count bins",
        natural: "Natural Breaks (K Means clustering)",
        help: {
            title: "Binning",
            r_help: "help(binVariable,package='RcmdrMisc')",
            body: `
<b>Description</b></br>
Create a factor dissecting the range of a numeric variable into bins of equal width, (roughly) equal frequency, or at "natural" cut points (determined by K-means clustering)
<br/>
<b>Usage</b>
<br/>
<code> 
binVariable(x, bins = 4, method = c("intervals", "proportions", "natural"),labels = FALSE)
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









class binNumericVariables extends baseModal {
    constructor() {
        var config = {
            id: "binNumericVariables",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
{{selected.varname | safe}} <- BlueSky::BSkybinVariable({{selected.vartobin | safe}}, bins={{selected.noofbins | safe}}, method={{selected.BinMethod | safe}}, labels={{if (options.selected.levelnames !== "c('')")}}{{selected.levelnames | safe}}{{/if}}{{selected.levelnames1 | safe}})
#Refresh the dataset in the data grid
BSkyLoadRefresh("{{dataset.name}}")
`
        }
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            vartobin: {
                el: new dstVariable(config, {
                    label: localization.en.vartobin,
                    no: "vartobin",
                    filter: "Numeric|Date|Scale",
                    extraction: "Prefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            varname: {
                el: new input(config, {
                    label: localization.en.varname,
                    no: "varname",
                    extraction: "PrefixByDatasetName",
                    placeholder: "",
                    overwrite: "variable",
                    required: true,
                    value: "",
                }), r: ['{{ var | safe}}']
            },
            noofbins: {
                el: new inputSpinner(config, {
                    no: 'noofbins',
                    label: localization.en.noofbins,
                    min: 2,
                    max: 9999999,
                    step: 1,
                    value: 4,
                    extraction: "NoPrefix|UseComma"
                })
            },
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 5, style: "mt-2" }) },
            Names: { el: new radioButton(config, { label: localization.en.Names, no: "levelnames1", increment: "Names", value: "", state: "checked", extraction: "ValueAsIs", required: true, dependant_objects: ['levelnames'] }) },
            levelnames: {
                el: new input(config, {
                    label: localization.en.levelnames,
                    ml: 4,
                    no: "levelnames",
                    extraction: "CreateArray",
                    value: "",
                    placeholder: "",
                    type: "character",
                    allow_spaces:true,
                }), r: ['{{ var | safe}}']
            },
            Numbers: { el: new radioButton(config, { label: localization.en.Numbers, no: "levelnames1", increment: "Numbers", value: "FALSE", state: "", extraction: "ValueAsIs" }) },
            Ranges: { el: new radioButton(config, { label: localization.en.Ranges, no: "levelnames1", increment: "Ranges", value: "NULL", state: "", extraction: "ValueAsIs" }) },
            label2: { el: new labelVar(config, { label: localization.en.label2, h: 5,style: "mt-2", }) },
            equalwidth: { el: new radioButton(config, { label: localization.en.equalwidth, no: "BinMethod", increment: "equalwidth", value: "'intervals'", state: "checked", extraction: "ValueAsIs" }) },
            equalcount: { el: new radioButton(config, { label: localization.en.equalcount, no: "BinMethod", increment: "equalcount", value: "'proportion'", state: "", extraction: "ValueAsIs" }) },
            natural: { el: new radioButton(config, { label: localization.en.natural, no: "BinMethod", increment: "natural", value: "'natural'", state: "", extraction: "ValueAsIs" }) },
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.vartobin.el.content, objects.varname.el.content, objects.noofbins.el.content, objects.label1.el.content, objects.Names.el.content, objects.levelnames.el.content, objects.Numbers.el.content, objects.Ranges.el.content, objects.label2.el.content, objects.equalwidth.el.content, objects.equalcount.el.content, objects.natural.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-bin",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new binNumericVariables().render()