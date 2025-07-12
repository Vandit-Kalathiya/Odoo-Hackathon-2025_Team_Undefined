package com.stackit.chat_manage_service.Config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class DataSizeConverter implements Converter<String, Long> {
    @Override
    public Long convert(String source) {
        if (!StringUtils.hasLength(source)) {
            return null;
        }

        source = source.toUpperCase();
        long multiplier = 1;

        if (source.endsWith("KB")) {
            multiplier = 1024;
            source = source.substring(0, source.length() - 2);
        } else if (source.endsWith("MB")) {
            multiplier = 1024 * 1024;
            source = source.substring(0, source.length() - 2);
        } else if (source.endsWith("GB")) {
            multiplier = 1024 * 1024 * 1024;
            source = source.substring(0, source.length() - 2);
        }

        return Long.parseLong(source) * multiplier;
    }
}
