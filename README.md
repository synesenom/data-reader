# data-reader
Simple tool to read data points from a chart image.

# usage

1. Drop an image file in the blue drop area. Once the image is loaded, you'll see two green rulers and a green data marker
appear on the top left corner of the image. The image is loaded in its true size for the best precision.
2. Move the rulers to the axes by dragging their bodies (line) or end points (circles). If you're ready, you can fix their
positions to ensure they are not moved away accidentally. In the first two control cards you can set the start and end values
for the rulers according to the axes on the chart (only linear axes are supported now). The rulers will be used to map the
data marker's position on the chart to actual data points.
3. When the rulers are fixed and ready, move the data marker to a data point you want to measure, and click on
'Save data point'. This will add the current data point to the dataset. The data points are not shown by default, but you can
display them by checking the 'Display data' checkbox. If needed, you can change the size of the data marker as well.
4. The 'Data' card will show you all the collected data points. Here you can highlight each data point, remove them (by
clicking on the red cross) or download the dataset as a CSV file containing their x and y coordinates.
5. For fine position adjustment, you can actually select the control elements: a ruler's body or end points, or the data
marker. Simply click on the control element and once it turns red, you can move them by the arrow keys. The arrows will shift
the currently selected control element by 0.2 pixel.
