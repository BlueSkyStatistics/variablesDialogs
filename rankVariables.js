
var localization = {
    en: {
        title: "Rank Variable(s)",
        navigation: "Rank",
        label1: "Enter a suffix or prefix for the new ranked variables",
        suffix: "Suffix",
        prefix: "Prefix",
        txt1: "Enter a suffix/prefix",
        dest: "Select the variable(s) to rank",
        rankby: "Optionaly select variable(s) to rank values within",
        label2: "Specify a ranking function",
        rankfn: "Select a ranking function, click on help for additional information",
        nooftiles: "For the ranking function ntile specify the number of groups to split into:",
        help: {
            title: "Rank Variable(s)",
            r_help: "help(mean)",
            body: `
<b>Description</b></br>
RANKS WILL BE STORED IN NEW VARIABLES  WITH THE PREFIX OR SUFFIX SPECIFIED</br>
Six variations on ranking functions, mimicking the ranking functions described in SQL2003. They are currently implemented using the built in rank function, and are provided mainly as a convenience when converting between R and SQL. All ranking functions map smallest inputs to smallest outputs. Use desc() to reverse the direction.
<br/>
<b>Usage</b>
<br/>
<code> 
row_number(x)
ntile(x, n)
min_rank(x)
dense_rank(x)
percent_rank(x)
cume_dist(x)
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
x: A vector of values to rank. Missing values are left as is. If you want to treat them as the smallest or largest values, replace with Inf or -Inf before ranking.
</li>
<li>
n: number of groups to split up into.
</li>
</ul>
<b>Details</b><br/>
row_number(): equivalent to rank(ties.method = "first")<br/>
min_rank(): equivalent to rank(ties.method = "min")<br/>
dense_rank(): like min_rank(), but with no gaps between ranks<br/>
percent_rank(): a number between 0 and 1 computed by rescaling min_rank to [0, 1]<br/>
cume_dist(): a cumulative distribution function. Proportion of all values less than or equal to the current rank.<br/>
ntile(): a rough rank, which breaks the input vector into n buckets.<br/>
<b>Examples</b><br/>
<code> 
x <- c(5, 1, 3, 2, 2, NA)<br/>
row_number(x)<br/>
min_rank(x)<br/>
dense_rank(x)<br/>
</code><br/>
<b>Package</b></br>
dplyr</br>
<b>Help</b></br>
help(ranking, package='dplyr')`}
    }
}










class rankVariables extends baseModal {
    constructor() {
        var config = {
            id: "rankVariables",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
require(dplyr)
{{dataset.name}} <- {{dataset.name}} {{if (options.selected.rankby !="")}} %>%\n\tgroup_by({{selected.rankby | safe}}){{/if}}{{selected.rankString | safe}}
\nBSkyLoadRefresh("{{dataset.name}}")
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            suffix: { el: new radioButton(config, { label: localization.en.suffix, no: "rdgrp1", increment: "suffix", value: "Suffix", state: "checked", extraction: "ValueAsIs" }) },
            prefix: { el: new radioButton(config, { label: localization.en.prefix, no: "rdgrp1", increment: "prefix", value: "Prefix", state: "", extraction: "ValueAsIs", }) },
            txt1: {
                el: new input(config, {
                    no: 'txt1',
                    label: localization.en.txt1,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    required: true,
                    ml: 4,
                    type: "character"
                }),
            },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            dest: {
                el: new dstVariableList(config, {
                    label: localization.en.dest,
                    no: "dest",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            rankby: {
                el: new dstVariableList(config, {
                    label: localization.en.rankby,
                    no: "rankby",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            label2: { el: new labelVar(config, { label: localization.en.label2,style: "mt-3",h: 5 }) },
            rankfn: {
                el: new comboBox(config, {
                    no: 'rankfn',
                    label: localization.en.rankfn,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    required: true,
                    options: ["row_number", "min_rank", "dense_rank", "percent_rank", "cume_dist", "ntile",]
                })
            },
            nooftiles: {
                el: new inputSpinner(config, {
                    no: 'nooftiles',
                    label: localization.en.nooftiles,
                    min: 1,
                    max: 9999999,
                    step: 1,
                    value: 5,
                    extraction: "NoPrefix|UseComma"
                }),
            },
        }
        const content = {
            head: [objects.label1.el.content, objects.suffix.el.content, objects.prefix.el.content, objects.txt1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.dest.el.content, objects.rankby.el.content,],
            bottom: [objects.label2.el.content, objects.rankfn.el.content, objects.nooftiles.el.content],
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
        var rankString = "%>%\n\tmutate(";
        var rankfn = "";
        var txt1 = "";
        rankfn = instance.objects.rankfn.el.getVal()
        txt1 = instance.objects.txt1.el.getVal()
        let nooftiles = instance.objects.nooftiles.el.getVal()
        var prefixOrSuffix = common.getCheckedRadio("rankVariables_rdgrp1");
        instance.objects.dest.el.getVal().forEach(function (value) {
            var variable = "";
            variable = value;
            if (prefixOrSuffix == "Prefix") {
                if (rankfn == "ntile") {
                    rankString = rankString.concat(txt1, "_", variable, "=", rankfn, "(", variable, ",", nooftiles, "),")
                }
                else {
                    rankString = rankString.concat(txt1, "_", variable, "=", rankfn, "(", variable, "),")
                }
            }
            else {
                if (rankfn == "ntile") {
                    rankString = rankString.concat(variable, "_", txt1, "=", rankfn, "(", variable, ",", nooftiles, "),")
                }
                else {
                    rankString = rankString.concat(variable, "_", txt1, "=", rankfn, "(", variable, "),")
                }
            }
        })
        rankString = rankString.slice(0, -1);
        rankString = rankString.concat(")");
        var code_vars = {
            dataset: {
                name: getActiveDataset()
            },
            selected: {
                rankby: instance.objects.rankby.el.getVal(),
                rankString: rankString,
            }
        }
        res.push({ cmd: instance.dialog.renderR(code_vars), cgid: newCommandGroup() })
        return res;
    }
}
module.exports.item = new rankVariables().render()