---
layout: post
title: Income Explorer
---

**The goal of this project was to create interactive web maps for investigating the relationship between household income and geography.**  Particularly I wanted to do this in a reproducible manner to make it easily extensible to many regions and spatial scales.

### This projects consists of two significant components:

#### 1. Getting and cleaning data

Making a good map is dependent upon finding useful geographic shapes and corresponding attributes.  The US Census provides an excellent source of data in this regard, but the vast amount of data presents a challenge to those wishing to use it.  

The first challenge of my project required programmatically accessing, filtering, and cleaning data and geographic shape files from the US Census website. A summary of the procedures used to gather and process this data can be found in the [code]({{ site.baseurl }}code/) section.

**Tools used:** Python, [pandas](http://pandas.pydata.org/), [geopandas](http://geopandas.org/), [Sunlight Labs Census API](https://github.com/sunlightlabs/census)

#### 2. Visualizing data as an interactive map

Income and other demographic attributes are commonly mapped for a number of different purposes.  However, these maps are often static and rely on a single summary statistic when a detailed distribution of the data is often available.

For the second component of my project, I wanted to create [interactive maps]({{ site.baseurl }}maps/) to allow users to explore beyond the summary statistics.  Users can identify demographic slices and view where these slices are physically distributed.  Interacting with the data in this way provides a much better understanding of the relationship between demographics and geography.

**Tools used:** Javascript, [d3.js](http://d3js.org/), [jquery](https://jquery.com/), [jquery-ui](https://jqueryui.com/), [jekyll](https://jekyllrb.com/)


This project was created during the [2015 Baltimore Hackathon](http://www.baltimorehackathon.com).

