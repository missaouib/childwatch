package com.remarkablesystems.childwatch.graphql;

import graphql.language.StringValue;
import graphql.schema.Coercing;
import graphql.schema.GraphQLScalarType;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class CustomScalars {
    public static final GraphQLScalarType DATE_SCALAR = new GraphQLScalarType(
            "Date",
            "Date-only value",
            new Coercing() {
                @Override
                public Object serialize(Object input) {
                    if (input instanceof LocalDate) {
                        return ((LocalDate) input).toString();
                    } else {
                        return null;
                    }
                }

                @Override
                public Object parseValue(Object input) {
                    if (input instanceof CharSequence) {
                        return LocalDate.parse((CharSequence) input);
                    }
                    return null;
                }

                @Override
                public Object parseLiteral(Object input) {
                    if (input instanceof StringValue) {
                        return LocalDate.parse(((StringValue) input).getValue());
                    } else {
                        return null;
                    }
                }
            });

    public static final GraphQLScalarType DATE_TIME_SCALAR = new GraphQLScalarType(
            "DateTime",
            "Date-time value with timezone offset",
            new Coercing() {
                @Override
                public Object serialize(Object input) {
                    if (input instanceof OffsetDateTime) {
                        return ((OffsetDateTime) input).toString();
                    } else {
                        return null;
                    }
                }

                @Override
                public Object parseValue(Object input) {
                    if (input instanceof CharSequence) {
                        return OffsetDateTime.parse((CharSequence) input);
                    }
                    return null;
                }

                @Override
                public Object parseLiteral(Object input) {
                    if (input instanceof CharSequence) {
                        return OffsetDateTime.parse((CharSequence) input);
                    } else {
                        return null;
                    }
                }
            });
}
