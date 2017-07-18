package com.remarkablesystems.childwatch.demo;

import java.util.Collection;
import java.util.Optional;

public class RandomUtil {
    public static final <T> Optional<T> randomElement(Collection<T> coll) {
        return coll.stream().skip((int) (Math.random() * coll.size())).findFirst();
    }
}
