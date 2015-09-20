---
layout: page
title: Code
---

Code for acquiring and cleaning data

Here I will go over my basic code for acquiring data for this project:

{% highlight python %}
import os.path
from census import Census
from us import states
import geopandas as gpd
import pandas as pd
import zipfile

# Specify state and county to download (select one)
loc_name, state_code, county_codes = "balt_city", states.MD.fips, list([510]) # Baltimore

# Create county list (string representation of county IDs)
county_list = ["{:03d}".format(county_id) for county_id in county_codes]

# CENSUS API Stuff
CENSUS_API = # Your key here
c = Census(CENSUS_API) # Initialize census class with API key

# Generate codes for census variables of interest
var_ids = ["B19001_0{:02d}E".format(x) for x in range(2, 18)] # Household income over 12 months

# TIGER Stuff
TIGER_BASE_URL = 'http://www2.census.gov/geo/tiger/TIGER2013/'

tiger_zip_file = 'tl_2013_{0}_bg.zip'.format(state_code)
tiger_shape_file = 'tl_2013_{0}_bg.shp'.format(state_code)
{% endhighlight %}

### Getting Census Data

I wrote a simple function to generate a FIPS code given its individual components

{% highlight python %}
def build_bg_fips(record):
    fips_code = record['state'] + record['county'] + record['tract'] + record['block group']
    return str(fips_code)
{% endhighlight %}

Additionally I wrote a function to use the Census API wrapper from Sunlight Labs to request the records I'm interested in and convert them to a pandas DataFrame.

{% highlight python %}
def census_to_dataframe(var_list, state_code, county_codes):
    fips_codes = []
    all_records = []
    
    for county in county_codes:        
        census_data = c.acs.get(var_list, {'for': 'block group:*', 'in': 'state:{0} county:{1}'.format(state_code, county)})
        
        for idx, record in enumerate(census_data):
            # Build fips codes
            fips_code = build_bg_fips(record)
            census_data[idx]["fips"] = fips_code

            # Eliminate original code components
            key_list = ['state', 'county', 'tract', 'block group']
            for key in key_list:
                if key in census_data[idx]: 
                    del census_data[idx][key]
        
        all_records.extend(census_data)
        
    census_df = pd.DataFrame(all_records)
    census_df = census_df.set_index("fips")
                
    return census_df
{% endhighlight %}

## Getting Shape Data

Acquiring the TIGER shape data was actually pretty straightforward.

{% highlight python %}
import requests

r = requests.get(FULL_TIGER_URL)
if r.status_code == requests.codes.ok:
    with open(local_tiger_zip_file, "wb") as f:
        f.write(r.content)
{% endhighlight %}

### Pruning Shape Data

The trouble is that TIGER data comes packaged at the state level, so there are a lot of shapes we don't actually need.

{% highlight python %}
# Unzip file, extract contents
zfile = zipfile.ZipFile(LOCAL_DATA_DIR + GEO_SUB_DIR + tiger_zip_file)
zfile.extractall(LOCAL_DATA_DIR + GEO_SUB_DIR)

# Load to GeoDataFrame
shapes = gpd.GeoDataFrame.from_file(LOCAL_DATA_DIR + GEO_SUB_DIR + tiger_shape_file)

# Only keep counties that we are interested in
shapes = shapes[shapes["COUNTYFP"].isin(county_list)]
{% endhighlight %}

### Exporting Shape Data for the Web

Even though we have eliminated many of the shapes we don't need, the shape data still has additional attributes that are not necessary for the map.

{% highlight python %}
small_shapes = gpd.GeoDataFrame()
small_shapes["geometry"] = shapes["geometry"].simplify(tolerance=0.0001) # Simplify geometry to reduce file size
small_shapes["fips"] = shapes["GEOID"]
small_shapes = small_shapes.set_index("fips")
small_json = small_shapes.to_json()

# Write to file
with open(geo_outfile, 'w') as f:
    f.write(small_json)
{% endhighlight %}