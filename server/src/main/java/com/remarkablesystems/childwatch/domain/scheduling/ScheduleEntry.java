package com.remarkablesystems.childwatch.domain.scheduling;

import java.io.Serializable;

public class ScheduleEntry implements Serializable {
    public final int start;// Minutes from midnight
    public final int end;// Minutes from midnight

    private ScheduleEntry() {
        this(0, 0);
    }

    public ScheduleEntry(int start, int end) {
        this.start = start;
        this.end = end;
    }

    @Override
    public String toString() {
        return "ScheduleEntry{" +
                "start=" + start +
                ", end=" + end +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ScheduleEntry)) return false;

        ScheduleEntry that = (ScheduleEntry) o;

        if (start != that.start) return false;
        return end == that.end;
    }

    @Override
    public int hashCode() {
        int result = start;
        result = 31 * result + end;
        return result;
    }

    // Getters needed for GraphQL tools only
    public int getEnd() {
        return end;
    }

    // Getters needed for GraphQL tools only
    public int getStart() {
        return start;
    }
}
