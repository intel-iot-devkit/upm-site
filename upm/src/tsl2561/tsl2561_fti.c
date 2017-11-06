/*
 * Author: Nandkishor Sonar <Nandkishor.Sonar@intel.com>,
 *         Abhishek Malik <abhishek.malik@intel.com>
 * Copyright (c) 2014 Intel Corporation.
 *
 * LIGHT-TO-DIGITAL CONVERTER [TAOS-TSL2561]
 *   Inspiration and lux calculation formulas from data sheet
 *   URL: http://www.adafruit.com/datasheets/TSL2561.pdf
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#include "tsl2561.h"
#include "upm_fti.h"

/** 
 * This file implements the Function Table Interface (FTI) for this sensor
 */

const char upm_tsl2561_name[] = "TSL2561";
const char upm_tsl2561_description[] = "Grove Digital Light Sensor";
const upm_protocol_t upm_tsl2561_protocol[] = {UPM_I2C};
const upm_sensor_t upm_tsl2561_category[] = {UPM_LIGHT};

// forward declarations
const upm_sensor_descriptor_t upm_tsl2561_get_descriptor ();
const void* upm_tsl2561_get_ft(upm_sensor_t sensor_type);
void* upm_tsl2561_init_name();
void upm_tsl2561_close(void* dev);
upm_result_t upm_tsl2561_get_lux(const void* dev, float* lux);

const upm_sensor_descriptor_t upm_tsl2561_get_descriptor (){
    upm_sensor_descriptor_t usd;
    usd.name = upm_tsl2561_name;
    usd.description = upm_tsl2561_description;
    usd.protocol_size = 1;
    usd.protocol = upm_tsl2561_protocol;
    usd.category_size = 1;
    usd.category = upm_tsl2561_category;
    return usd;
}

static const upm_sensor_ft ft =
{
    .upm_sensor_init_name = &upm_tsl2561_init_name,
    .upm_sensor_close = &upm_tsl2561_close,
    .upm_sensor_get_descriptor = &upm_tsl2561_get_descriptor
};

static const upm_light_ft lft =
{
    .upm_light_get_value = &upm_tsl2561_get_lux
};

const void* upm_tsl2561_get_ft(upm_sensor_t sensor_type){
    if(sensor_type == UPM_LIGHT){
        return &lft;
    }
    else if(sensor_type == UPM_SENSOR){
        return &ft;
    }
    return NULL;
}

void* upm_tsl2561_init_name(){
    return NULL;
}

void upm_tsl2561_close(void* dev){
    tsl2561_close((tsl2561_context)dev);
}

upm_result_t upm_tsl2561_get_lux(const void* dev, float* lux){
    return tsl2561_get_lux((tsl2561_context)dev, lux);
}
