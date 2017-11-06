/*
 * Author: Abhishek Malik <abhishek.malik@intel.com>
 * Copyright (c) 2017 Intel Corporation.
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
#pragma once

#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

#include "upm.h"
#include "mraa/i2c.h"

#ifdef __cplusplus
extern "C" {
#endif

#define VEML6070_CTRL_REG             0x38    // write only
#define VEML6070_SEQ1_DATA_BUF_REG    0x39    // read only
#define VEML6070_SEQ2_DATA_BUF_REG    0x38    // read only

typedef enum {
    HALF_T = 0,
    ONE_T,
    TWO_T,
    FOUR_T } veml6070_integration_time_t;

/**
 * @file veml6070.h
 * @library veml6070
 * @brief C API for the VEML6070 Vishay UV Sensor
 *
 * @include veml6070.c
 */

typedef struct _veml6070_context {
    mraa_i2c_context       i2c_seq1;
    mraa_i2c_context       i2c_seq2;
    uint8_t                address_seq1;
    uint8_t                address_seq2;
    uint8_t                i2c_bus_number;
} *veml6070_context;

/**
 * VEML6070 Initialization function
 *
 * @param bus I2C bus to use
 * @param address I2C address to use
 *
 * @return device context pointer
 */
veml6070_context veml6070_init(uint8_t bus);

/**
 * VEML6070 Close function
 *
 * @param dev veml6070_context pointer
 */
void veml6070_close(veml6070_context dev);

/**
 * Function to get the UV values
 *
 * @param dev veml6070_context pointer
 * @return int16_t UV value
 */
int16_t veml6070_get_uv_intensity(veml6070_context dev);

/**
 * Function to set the integration time of the sensor
 *
 * @param dev veml6070_context pointer
 * @param time veml6070_integration_time_t
 *
 * @return upm_result_t
 */
upm_result_t veml6070_set_integration_time(veml6070_context dev, veml6070_integration_time_t time);

#ifdef __cplusplus
}
#endif
