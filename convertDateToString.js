
var localization = {
    en: {
        title: "Convert Date Variables To Character",
        navigation: "Date to Character",
        label1: "Select a suffix or prefix for converted variables",
        suffix: "Suffix",
        prefix: "Prefix",
        prefixOrSuffix: "Enter a prefix or suffix",
        Destination: "Select date variables to convert to character",
        DateFormat: "Select the date format to convert to",
        TimeZone: "Select a time zone (default -nothing  selected is the local time zone of the PC)",
        help: {
            title: "Convert Date To character",
            r_help: "help(strftime, package=\"base\")",
            body: `
<b>Description</b></br>
Converts date (posixct and date class) to character -to control the format in which the date is displayed. You specify as input the format in which the string should be generated i.e. year/month/Day or month-dat=year etc.
The function above internally calls strftime in the base package. We have extended strftime to support multiple variables.
<br/>
<b>Usage</b>
<br/>
<code> 
BSkystrftime <-function (varNames = "", dateFormat = "", timezone = "", prefixOrSuffix = "suffix", 
    prefixOrSuffixValue = "", data = "") 
</code> <br/>
<b>Arguments</b><br/>
<ul>
<li>
​data: The dataset name
</li>
<li>
varNames: The variables of class posixct and date class that need to be converted​ to character
</li>
<li>
dateFormat: A character string. The default for the format methods is "%Y-%m-%d %H:%M:%S" if any element has a time component which is not midnight, and "%Y-%m-%d" otherwise. If options("digits.secs") is set, up to the specified number of digits will be printed for seconds
</li>
<li>
timezone: A character string specifying the time zone to be used for the conversion. System-specific (see as.POSIXlt), but "" is the current time zone, and "GMT" is UTC. Invalid values are most commonly treated as UTC, on some platforms with a warning.
</li>
<li>
prefixOrSuffix: Specific a prefix or suffix for the new string variables. Takes either c("prefix") or c("suffix"). New variables that are created with this prefix/suffix to the original variable name. 
</li>
</ul>
<b>Package</b></br>
base</br>
<b>Help</b></br>
help(strftime)    
`}
    }
}










class convertDateToString extends baseModal {
    constructor() {
        var config = {
            id: "convertDateToString",
            label: localization.en.title,
            modalType: "two",
            splitProcessing:false,
            RCode: `
BSkystrftime (varNames = c({{selected.Destination | safe}}), dateFormat = "{{selected.DateFormat | safe}}", timezone = "{{selected.TimeZone | safe}}", prefixOrSuffix = "{{selected.rdgrp1 | safe}}",  prefixOrSuffixValue = "{{selected.prefixOrSuffix | safe}}", data = "{{dataset.name}}") 
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
                    filter: "Numeric|Date",
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
                    options: ["%m-%d-%y", "%m-%d-%y %H:%M:%S", "%m-%d-%y %I:%M:%S %p", "%b %d, %y", "%b %d, %y %H:%M:%S", "%m-%d-%Y", "%m-%d-%Y  %H:%M:%S", "%m-%d-%Y %I:%M:%S %p", "%b %d, %Y", "%b %d, %Y %H:%M:%S", "%m/%d/%y", "%m/%d/%y %H:%M:%S", "%m/%d/%y %I:%M:%S %p", "%b %d, %y", "%b %d, %y %H:%M:%S", "%m/%d/%Y", "%m/%d/%Y %H:%M:%S", "%m/%d/%Y %I:%M:%S %p", "%b %d, %Y", "%b %d, %Y %H:%M:%S", "%d-%m-%y", "%d-%m-%y %H:%M:%S", "%d-%m-%y %I:%M:%S %p",
                        "%d %b, %y", "%d %b, %y %H:%M:%S", "%d-%m-%Y", "%d-%m-%Y %H:%M:%S", "%d-%m-%Y %I:%M:%S %p", "%d %b, %Y", "%d %b, %Y  %H:%M:%S", "%d/%m/%y", "%d/%m/%y %H:%M:%S", "%d/%m/%y %I:%M:%S %p", "%d %b, %y", "%d %b, %y %H:%M:%S", "%d/%m/%Y", "%d/%m/%Y %H:%M:%S", "%d/%m/%Y %I:%M:%S %p", "%d %b, %Y", "%d %b, %Y  %H:%M:%S", "%Y-%m-%d  %H:%M:%S", "%Y-%m-%d", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d %I:%M:%S", "%Y-%d-%m", "%Y-%d-%m %H:%M:%S", "%Y-%d-%m %I:%M:%S", "%y-%m-%d", "%y-%m-%d %H:%M:%S", "%y-%m-%d %I:%M:%S",
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
                icon: "icon-abc",
                onclick: `r_before_modal("${config.id}")`,
                
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new convertDateToString().render()