package com.remarkablesystems.childwatch.graphql;

import com.remarkablesystems.childwatch.domain.scheduling.ScheduleEntry;

import java.beans.ConstructorProperties;

public class ScheduleEntryInput extends ScheduleEntry {

    @ConstructorProperties({"start", "end"})
    public ScheduleEntryInput(int start, int end) {
        super(start, end);
    }

    @Override
    public String toString() {
        return "ScheduleEntryInput{" +
                "start=" + start +
                ", end=" + end +
                '}';
    }
}

