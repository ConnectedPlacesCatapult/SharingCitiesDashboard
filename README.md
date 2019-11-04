Analytics: [![wercker status](https://app.wercker.com/status/350323c0db166acb5049b26ec2330f42/s/master "wercker status")](https://app.wercker.com/project/byKey/350323c0db166acb5049b26ec2330f42)  Frontend: [![CircleCI](https://circleci.com/gh/FutureCitiesCatapult/SharingCitiesDashboard/tree/master.svg?style=svg)](https://circleci.com/gh/FutureCitiesCatapult/SharingCitiesDashboard/tree/master)



# Sharing Cities Dashboard

![](images/logo.jpg)

## Table of Contents:

- [Introduction](#introduction)
- [Description](#description)
    * [Backend](#backend)
- [Requirements](#requirements)
- [Installing and setting up host](#installing-and-setting-up-the-host)
- [Quick Start](#quick-start)

## Introduction
### What is sharing cities?
Sharing Cities, the European Commission funded Horizon 2020 project, seeks to create a better, common approach to making smart cities a reality. By fostering international collaboration between industry and cities, the project seeks to develop affordable, integrated, commercial-scale smart city solutions with a high market potential. For more information on the project click [here](http://www.sharingcities.eu/).

### What is this tool?
This tool, provides an interface to city managers for visualising and monitoring the performance of smart city measures such as those relating to housing retrofit, integrated energy management, shared eMobility and smart lampposts. Different combinations of these 'measures' have been deployed in Greenwich, Lisbon and Milan and so this dashboard caters for each location specifically. 

To supply data to the dashboard, each city is hosting an Urban Sharing Platform (USP), which makes data from the Sharing Cities smart city measures available through APIs. In some cases, the dashboards also integrate information from other locally relevant APIs such as weather. 

### What is our vision?
Users of this dashboard will have expertise from a broad range of domains. This includes city managers, heads of service in energy, transport and the environment and potentially even the public. As a result, when investigating data from the measures, the needs of each individual are very different meaning that we cannot custom-build a tool for all needs. 

To circumvent this challenge, we have developed a tool that enables users to create interactive visualisations tailored to their needs. The users will be able to:

- Explore the data available to them through the USP in their city
- Perform forecasting on data from specific sensors or specific time-series
- Create visualisations that they want on their dashboard
- Create thresholds on specific attributes that can trigger 'alerts' in the dashboard

## Description
This repo holds the code, deployment configuration and instructions for SharingCities dashboard. The implementation of the dashboard consists of two parts:

- A [Flask](https://flask.palletsprojects.com/en/1.1.x/) based backend server. The code is located in the [Analytics](Analytics)
- A frontend implementation based on [React](https://reactjs.org/)

### Backend
#### Database structure 
At the very core of backend implementation of SharingCities Dashboard there is a Postgres/Postgis database holding the metadata related to the endpoint APIs the sensors and their attributes, the sourced data as well as dashboard related housekeeping data. 

![](images/scd-metadata.png)

A functionality description for each table is given below:

``` layouts ``` This table stores the position and dimensions of each widget. It also contains a flag indicating weather the widget is static (on off visualisation) or dynamic (updated whenever new data are imported).

``` widjets ``` This table stores the widgets specifications for each user and each layout. It shares a relationship with ``` layouts ``` table.

``` users ``` 
## Deployment 

## Modules

### Back end
### Analytics
### Front end

## Quick-start







