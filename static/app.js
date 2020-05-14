var dropdownIds = d3.select("#selDataset");
var demographic = d3.select("#sample-metadata");

d3.json("samples.json").then((importedData) => {
    var data = importedData;

    var names = data.names;

    // Adding values to the dropdown box
    names.forEach(function (name) {
        dropdownIds.append("option").text(name);
    })

    var dropdownValue = dropdownIds.node().value

    init(dropdownValue);

});


function init(value) {
    d3.json("samples.json").then((importedData) => {
        var data = importedData;

        var sample = data.samples;
        var metadata = data.metadata;

        var filtered_sample_data = sample.filter(record => record.id == value)[0];
        console.log(filtered_sample_data);
        var bar_otu_ids = [];
        var bar_otu_labels = [];
        var bar_otu_values = [];
        var numb_uto = filtered_sample_data.otu_ids.length

        // Storing the top 10 values for the bar chart
        if (numb_uto < 10) {
            console.log(numb_uto);
            for (var i = 0; i < numb_uto; i++) {
                bar_otu_ids.push("OTU " + filtered_sample_data.otu_ids[i]);
                bar_otu_labels.push(filtered_sample_data.otu_labels[i]);
                bar_otu_values.push(filtered_sample_data.sample_values[i]);
            }
        }
        else {
            for (var i = 0; i < 10; i++) {
                bar_otu_ids.push("OTU " + filtered_sample_data.otu_ids[i]);
                bar_otu_labels.push(filtered_sample_data.otu_labels[i]);
                bar_otu_values.push(filtered_sample_data.sample_values[i]);
            }
        }
        var filtered_metadata_data = metadata.filter(record => record.id == value)[0];
        var wf = filtered_metadata_data.wfreq;

        // Trace for the bar chart
        trace_bar = {
            x: bar_otu_values.reverse(),
            y: bar_otu_ids.reverse(),
            text: bar_otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        var layout_bar = {
            title: `<b>Top 10 OTUs found</b>`,
            yaxis: {
                align: "left"
            },
            margin: {
                l: 80,
                r: 0,
                b: 100,
                t: 30,
                pad: 4
            }
        };
        var bar_chart = [trace_bar];
        Plotly.newPlot('bar', bar_chart, layout_bar);


        // Bubble Chart
        var bubble_otu_ids = filtered_sample_data.otu_ids;
        var bubble_otu_labels = filtered_sample_data.otu_labels;
        var bubble_otu_values = filtered_sample_data.sample_values;

        var trace_bubbles = {
            x: bubble_otu_ids,
            y: bubble_otu_values,
            mode: 'markers',
            text: bubble_otu_labels,
            marker: {
                color: bubble_otu_ids,
                size: bubble_otu_values
            }
        };
        var layout_bubbles = {
            title: `<b>All UTOs found in individual</b>`,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            },
            margin: {
                l: 50,
                r: 10,
                b: 100,
                t: 50,
                pad: 4
            }
        };
        data_bubbles = [trace_bubbles];
        Plotly.newPlot('bubble', data_bubbles, layout_bubbles);

        // Demographic Info
        Object.entries(filtered_metadata_data).forEach(function ([key, value]) {
            demographic.append("h5").text(`${key}: ${value}`)
        });

        //BONUS
        var data_gauge = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wf,
                title: { text: `${wf} scrubs per Week` },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9] },
                    bar: { color: "white" },
                    bgcolor: "rgb(31, 119, 180)",
                    threshold: {
                        line: { color: "white", width: 5 },
                        thickness: 0.75,
                        value: wf
                    }
                }
            }
        ];

        var layout_gauge = {
            width: 450,
            height: 350,
            margin: {
                l: 50,
                r: 10,
                b: 0,
                t: 0,
            }
        };
        Plotly.newPlot('gauge', data_gauge, layout_gauge);
    });
};

function optionChanged(value) {
    d3.json("samples.json").then((importedData) => {
        var data = importedData;

        var sample = data.samples;
        var metadata = data.metadata;

        demographic.html("");
        var filtered_sample_data = sample.filter(record => record.id == value)[0];
        var filtered_metadata_data = metadata.filter(record => record.id == value)[0];

        var bar_otu_ids = [];
        var bar_otu_labels = [];
        var bar_otu_values = [];
        var numb_uto = filtered_sample_data.otu_ids.length

        // Storing the top 10 values for the bar chart
        if (numb_uto < 10) {
            console.log(numb_uto);
            for (var i = 0; i < numb_uto; i++) {
                bar_otu_ids.push("OTU " + filtered_sample_data.otu_ids[i]);
                bar_otu_labels.push(filtered_sample_data.otu_labels[i]);
                bar_otu_values.push(filtered_sample_data.sample_values[i]);
            }
        }
        else {
            for (var i = 0; i < 10; i++) {
                bar_otu_ids.push("OTU " + filtered_sample_data.otu_ids[i]);
                bar_otu_labels.push(filtered_sample_data.otu_labels[i]);
                bar_otu_values.push(filtered_sample_data.sample_values[i]);
            }
        }

        Plotly.restyle("bar", "x", [bar_otu_values.reverse()]);
        Plotly.restyle("bar", "y", [bar_otu_ids.reverse()]);
        Plotly.restyle("bar", "text", [bar_otu_labels.reverse()]);

        var bubble_otu_ids = filtered_sample_data.otu_ids;
        var bubble_otu_labels = filtered_sample_data.otu_labels;
        var bubble_otu_values = filtered_sample_data.sample_values;
        Plotly.restyle("bubble", "x", [bubble_otu_ids]);
        Plotly.restyle("bubble", "y", [bubble_otu_values]);
        Plotly.restyle("bubble", "text", [bubble_otu_labels]);
        Plotly.restyle("bubble", "marker.color", [bubble_otu_ids]);
        Plotly.restyle("bubble", "marke.size", [bubble_otu_values]);

        Object.entries(filtered_metadata_data).forEach(function ([key, value]) {
            demographic.append("h5").text(`${key}: ${value}`)
        });

        // Bonus
        var filtered_metadata_data = metadata.filter(record => record.id == value)[0];
        var wf = filtered_metadata_data.wfreq;

        Plotly.restyle("gauge", "value", [wf]);
        Plotly.restyle("gauge", "gauge.threshold.value", [wf]);
        Plotly.restyle("gauge", "title.text", [`${wf} scrubs per Week`]);
    });
}