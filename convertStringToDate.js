
var localization = {
    en: {
        title: "Convert Character Variables To Date",
        navigation: "Character to Date",
        label1: "Select a suffix or prefix for converted variables",
        suffix: "Suffix",
        prefix: "Prefix",
        prefixOrSuffix: "Enter a prefix or suffix",
        Destination: "Select character variables to convert to date",
        DateFormat: "Select the format of the character string",
        TimeZone: "Select a time zone (default -nothing  selected is the local time zone of the PC)",
        help: {
            title: "Convert Character To Date",
            r_help: "help(strptime, package=\"base\")",
            body: `
<b>Description</b></br>
Converts a character to a date (POSIXct class). You need to specify the format of the date  stored in a character string.
The function above internally calls strptime in the base package. We have extended strftime to support multiple variables.
<br/>
<b>Usage</b>
<br/>
<code> 
BSkystrptime <-function (varNames = "", dateFormat = "", timezone = "", prefixOrSuffix = "suffix", 
    prefixOrSuffixValue = "", data = "") 
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
data: The dataset name as a character string.
</li>
<li>
varNames: The variable names of class character that need to be converted to date (POSIXct class)
</li>
<li>
dateFormat: A character string. The default for the format methods is "%Y-%m-%d %H:%M:%S" if any element has a time component which is not midnight, and "%Y-%m-%d" otherwise. If options("digits.secs") is set, up to the specified number of digits will be printed for seconds
</li>
<li>
timezone: A character string specifying the time zone to be used for the conversion. System-specific (see as.POSIXlt), but "" is the current time zone, and "GMT" is UTC. Invalid values are most commonly treated as UTC, on some platforms with a warning.
</li>
<li>
prefixOrSuffix: Specific a prefix or suffix for the converted variables of class POSIXct . Takes either c("prefix") or c("suffix"). New variables that are created with this prefix/suffix to the original variable name. 
</li>
<li>
prefixOrSuffixValue = A character vector that specifies the name of the prefix or suffix to be used.
</li>
</ul>
<b>Package</b></br>
base</br>
<b>Help</b></br>
help(strptime)
`}
    }
}










class convertStringToDate extends baseModal {
    constructor() {
        var config = {
            id: "convertStringToDate",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
BSkystrptime (varNames = c( {{selected.Destination | safe}}), dateFormat = "{{selected.DateFormat | safe}}", timezone = "{{selected.TimeZone | safe}}", prefixOrSuffix = "{{selected.rdgrp1 | safe}}",  prefixOrSuffixValue = "{{selected.prefixOrSuffix | safe}}", data = "{{dataset.name}}") 
BSkyLoadRefresh(bskyDatasetName="{{dataset.name}}",load.dataframe=TRUE)        
`,
            pre_start_r: JSON.stringify({
                TimeZone: "OlsonNames()",
            })
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 5 }) },
            suffix: { el: new radioButton(config, { label: localization.en.suffix, no: "rdgrp1", increment: "suffix", value: "suffix", state: "checked", extraction: "ValueAsIs" }) },
            prefix: { el: new radioButton(config, { label: localization.en.prefix, no: "rdgrp1", increment: "prefix", value: "prefix", state: "", extraction: "ValueAsIs", }) },
            prefixOrSuffix: {
                el: new input(config, {
                    no: 'prefixOrSuffix',
                    label: localization.en.prefixOrSuffix,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                    required: true,
                    ml: 4,
                    type: "character"
                }),
            },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            Destination: {
                el: new dstVariableList(config, {
                    label: localization.en.Destination,
                    no: "Destination",
                    filter: "String|Numeric|Date|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            DateFormat: {
                el: new comboBox(config, {
                    no: 'DateFormat',
                    label: localization.en.DateFormat,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    required: true,
                    // options:[],
                    options: ["%m-%d-%y", "%m-%d-%y %H:%M:%S", "%m-%d-%y %I:%M:%S %p", "%b %d, %y", "%b %d, %y %H:%M:%S", "%m-%d-%Y", "%m-%d-%Y  %H:%M:%S", "%m-%d-%Y %I:%M:%S %p", "%b %d, %Y", "%b %d, %Y %H:%M:%S", "%m/%d/%y", "%m/%d/%y %H:%M:%S", "%m/%d/%y %I:%M:%S %p", "%b %d, %y", "%b %d, %y %H:%M:%S", "%m/%d/%Y", "%m/%d/%Y %H:%M:%S", "%m/%d/%Y %I:%M:%S %p", "%b %d, %Y", "%b %d, %Y %H:%M:%S", "%d-%m-%y", "%d-%m-%y %H:%M:%S", "%d-%m-%y %I:%M:%S %p",
                        "%d %b, %y", "%d %b, %y %H:%M:%S", "%d-%m-%Y", "%d-%m-%Y %H:%M:%S", "%d-%m-%Y %I:%M:%S %p", "%d %b, %Y", "%d %b, %Y  %H:%M:%S", "%d/%m/%y", "%d/%m/%y %H:%M:%S", "%d/%m/%y %I:%M:%S %p", "%d %b, %y", "%d %b, %y %H:%M:%S", "%d/%m/%Y", "%d/%m/%Y %H:%M:%S", "%d/%m/%Y %I:%M:%S %p", "%d %b, %Y", "%d %b, %Y  %H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%Y-%m-%d %I:%M:%S", "%Y-%d-%m", "%Y-%d-%m %H:%M:%S", "%Y-%d-%m %I:%M:%S", "%y-%m-%d", "%y-%m-%d %H:%M:%S", "%y-%m-%d %I:%M:%S",
                        "%y-%d-%m", "%y-%d-%m %H:%M:%S", "%y-%d-%m %I:%M:%S", "%Y %m %d  %H:%M:%S", "%Y %m %d", "%Y %m %d %H:%M:%S", "%Y %m %d %I:%M:%S", "%Y %d %m", "%Y %d %m %H:%M:%S", "%Y %d %m %I:%M:%S", "%y %m %d", "%y %m %d %H:%M:%S", "%y %m %d %I:%M:%S", "%y %d %m", "%y %d %m %H:%M:%S", "%y %d %m %I:%M:%S", "%Y %m %d  %H:%M:%S", "%Y %m %d", "%Y %m %d %H:%M:%S", "%Y %m %d %I:%M:%S", "%Y %d %m", "%Y %d %m %H:%M:%S", "%Y %d %m %I:%M:%S", "%y %m %d", "%y %m %d %H:%M:%S", "%y %m %d %I:%M:%S", "%y %d %m", "%y %d %m %H:%M:%S", "%y %d %m %I:%M:%S"]
                })
            },
            TimeZone: {
                el: new comboBox(config, {
                    no: 'TimeZone',
                    label: localization.en.TimeZone,
                    multiple: true,
                    extraction: "NoPrefix|UseComma",
                    options: [],
                    default: ""
                })
            },
            //  suffix: { el: new radioButton(config, {label: localization.en.suffix, no: "rdgrp1", increment: "suffix", value: "Suffix", state: "checked", extraction: "ValueAsIs",dependant_objects: ["nooftiles"] })},
        }
        var timeZoneOptions = {
            el: new optionsVar(config, {
                no: "timeZoneOptions",
                name: "Advanced",
                content: [
                    objects.TimeZone.el,
                ]
            }
            )
        }
        const content = {
            head: [objects.label1.el.content, objects.suffix.el.content, objects.prefix.el.content, objects.prefixOrSuffix.el.content],
            left: [objects.content_var.el.content],
            right: [objects.Destination.el.content, objects.DateFormat.el.content,],
            bottom: [timeZoneOptions.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-date",
                onclick: `r_before_modal("${config.id}")`,
                modal_id: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new convertStringToDate().render()