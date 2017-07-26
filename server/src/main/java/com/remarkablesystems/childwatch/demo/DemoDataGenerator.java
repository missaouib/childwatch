package com.remarkablesystems.childwatch.demo;

import com.github.javafaker.Faker;
import com.google.common.collect.Multimap;
import com.remarkablesystems.childwatch.db.DatabaseMigration;
import com.remarkablesystems.childwatch.domain.meal.FoodItem;
import com.remarkablesystems.childwatch.domain.meal.repository.FoodComponentRepository;
import com.remarkablesystems.childwatch.domain.meal.repository.FoodItemRepository;
import com.remarkablesystems.childwatch.domain.meal.FoodComponent;
import com.remarkablesystems.childwatch.domain.people.*;
import com.remarkablesystems.childwatch.domain.room.Room;
import com.remarkablesystems.childwatch.domain.room.Rooms;
import com.remarkablesystems.childwatch.domain.scheduling.RoomAssignmentEntry;
import com.remarkablesystems.childwatch.domain.scheduling.Scheduling;
import com.remarkablesystems.childwatch.security.Authorities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Component;

import javax.annotation.Priority;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Stream;

import static com.google.common.collect.Multimaps.newListMultimap;
import static com.remarkablesystems.childwatch.demo.RandomUtil.randomElement;
import static java.lang.Math.random;
import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;
import static org.springframework.security.crypto.bcrypt.BCrypt.gensalt;
import static org.springframework.security.crypto.bcrypt.BCrypt.hashpw;

import static java.util.Objects.isNull;

@Component
@Priority(Integer.MIN_VALUE)
@Order(Integer.MIN_VALUE)
@Profile("development")
class DemoDataGenerator implements ResourceLoaderAware {
    private final Room ROOM_BUTTERFLY = new Room("Butterfly", 3, 18, 20);
    private final Room ROOM_DRAGONFLY = new Room("Dragonfly", 3, 16, 22);
    private final Room ROOM_OWL = new Room("Owl", 2, 10, 13);
    private final Room ROOM_FLYING_SQUIRREL = new Room("Flying Squirrel", 1, 7, 7);
    private final Room ROOM_MOSQUITO = new Room("Mosquito", 2, 10, 16);
    private final Room ROOM_PIGEON = new Room("Pigeon", 4, 20, 25);
    private final Room ROOM_BUMBLEBEE = new Room("Bumblebee", 3, 18, 21);
    private final Room[] DEMO_ROOMS = {ROOM_BUTTERFLY, ROOM_DRAGONFLY, ROOM_OWL, ROOM_FLYING_SQUIRREL, ROOM_MOSQUITO,
            ROOM_PIGEON, ROOM_BUMBLEBEE};
    private final Map<String, Room> roomsById = new HashMap<>();
    private final Map<String, Integer> roomOccupancy = new TreeMap<>();

    private final OffsetDateTime NOW = OffsetDateTime.now();
    private final LocalTime OPENING_TIME = LocalTime.of(7, 0);
    private final LocalTime CLOSING_TIME = LocalTime.of(18, 0);
    private final int SIMULATION_DAYS = 9;
    private final int SECONDS_IN_HOUR = 3600;
    private final List<SimulationParticipant> participants = new ArrayList<>();
    private final Multimap<String, String> nonParticipantsByFamily = newListMultimap(new HashMap<>(), LinkedList::new);

    private final Faker faker = new Faker();
    private final Random random = new Random();
    private final DatabaseMigration databaseMigration;
    private final UserDetailsManager userDetailsManager;
    private final Rooms rooms;
    private final People people;
    private final Scheduling scheduling;
    private final FoodItemRepository foodItemRepository;
    private final FoodComponentRepository foodComponentRepository;
	private ResourceLoader resourceLoader;
    
    public void setResourceLoader(ResourceLoader resourceLoader ) {
    	this.resourceLoader = resourceLoader;
    }
    
    public Resource getResource(String location ) {
    	return this.resourceLoader.getResource(location);
    }

    @Autowired
    DemoDataGenerator(DatabaseMigration databaseMigration, UserDetailsManager userDetailsManager, Rooms rooms, People
            people, Scheduling scheduling, FoodItemRepository foodItemRepository, FoodComponentRepository foodComponentRepository )  {
        this.databaseMigration = databaseMigration;
        this.userDetailsManager = userDetailsManager;
        this.rooms = rooms;
        this.people = people;
        this.scheduling = scheduling;
        this.foodItemRepository = foodItemRepository;
        this.foodComponentRepository = foodComponentRepository;
    }

    @EventListener({ApplicationReadyEvent.class})
    public void generate() {
        if (databaseMigration.domainMigrationExecuted()) {
            generateDomain();
        }
        if (databaseMigration.usersMigrationExecuted()) {
            generateUsers();
        }
    }

    private void generateDomain() {
        generateRooms();
        generateStaff();
        //generateFood();

        final int maxParticipants = Stream.of(DEMO_ROOMS).mapToInt(r -> r.getMaxCapacity()).sum();
        final int startParticipants = (int) Math.floor(maxParticipants * 0.3);
        final int targetParticipants = (int) Math.floor(maxParticipants * 0.75); // simulation target, not
        // necessarily sum(room_target)

        for (int dayOfSimulation = 0; dayOfSimulation < SIMULATION_DAYS; dayOfSimulation++) {
            // less 2 for today and tomorrow
            LocalDate date = LocalDate.now().minusDays(SIMULATION_DAYS - dayOfSimulation - 2);
            final int newParticipants = dayOfSimulation == 0 ? startParticipants : Math.round(targetParticipants -
                    startParticipants) / (SIMULATION_DAYS - 1);

            generateParticipants(newParticipants);
            generateParticipantTimelines(date);
            generateStaffTimelines(date);
        }
    }
    
	private void generateFoodCategories() {
    	FoodComponent[] afc = { new FoodComponent( "1", "Dairy and Egg Products"),
    	new FoodComponent( "2","Spices and Herbs"),
        new FoodComponent( "3","Baby Foods"),
    	new FoodComponent( "4","Fats and Oils"),
    	new FoodComponent( "5","Poultry Products"),
    	new FoodComponent( "6","Soups, Sauces, and Gravies"),
    	new FoodComponent( "7","Sausages and Luncheon Meats"),
    	new FoodComponent( "8","Breakfast Cereals"),
    	new FoodComponent( "9","Fruits and Fruit Juices"),
    	new FoodComponent( "10","Pork Products"),
    	new FoodComponent( "11","Vegetables and Vegetable Products"),
    	new FoodComponent( "12","Nut and Seed Products"),
    	new FoodComponent( "13","Beef Products"),
    	new FoodComponent( "14","Beverages"),
    	new FoodComponent( "15","Finfish and Shellfish Products"),
    	new FoodComponent( "16","Legumes and Legume Products"),
    	new FoodComponent( "17","Lamb, Veal, and Game Products"),
    	new FoodComponent( "18","Baked Products"),
    	new FoodComponent( "19","Sweets"),
    	new FoodComponent( "20","Cereal Grains and Pasta"),
    	new FoodComponent( "21","Fast Foods"),
    	new FoodComponent( "22","Meals, Entrees, and Side Dishes"),
    	new FoodComponent( "25","Snacks"),
    	new FoodComponent( "35","American Indian/Alaska Native Foods"),
    	new FoodComponent( "36","Restaurant Foods")};
    	
    	foodComponentRepository.save( Arrays.asList(afc) );
   }
    
	private void generateFood() {
		
		generateFoodCategories();
    	
    	Resource resource = this.getResource("classpath:data/food.csv" );
    	    	
    	try {
    		InputStream is = resource.getInputStream();
    		BufferedReader br = new BufferedReader( new InputStreamReader(is) );
    		
    		String line;
    		while( (line = br.readLine()) != null ) {
    			String[] splitLine = line.split("\\|");

    			FoodComponent fc = foodComponentRepository.findOne(splitLine[1]);
    			if( !isNull(fc) ) {
    				FoodItem food = new FoodItem( UUID.randomUUID().toString(), splitLine[2].trim(), fc );
    				fc.addFoodItem(food);
    				foodItemRepository.save(food);
    				System.out.println( food );
    			}
    		}
    		br.close();
    	}
    	catch( IOException e ) {
    		e.printStackTrace();
    	}    	
    }


    private void generateRooms() {
        for (Room room : DEMO_ROOMS) {
            rooms.createRoom(room);
            roomsById.put(room.getId(), room);
            roomOccupancy.put(room.getId(), 0);
        }
    }

    private void generateStaff() {
        final int staffCount = Stream.of(DEMO_ROOMS).mapToInt(r -> r.getStaffCapacity()).sum() * 2;
        Stream
                .generate(() -> new Staff(faker.name().firstName(), faker.name().lastName()))
                .limit(staffCount)
                .forEach(people::createStaff);
    }

    private void generateParticipants(int count) {
        for (int i = 0; i < count; i++) {
            Family family = familyForNewParticipant();
            SimulationParticipant p = generateParticipant(family);
            p.roomId = findRoom();
            participants.add(p);
            roomOccupancy.compute(p.roomId, (roomId, n) -> n + 1);
            Participant entity = new Participant(p.firstName, p.lastName, p.dateOfBirth, p.imgUrl);
            people.createParticipant(entity);
            people.addFamily(entity.getId(), family.getId());
            p.id = entity.getId();

            List<String> adults = new ArrayList<>(nonParticipantsByFamily.get(family.getId()));
            int parents = (int) Math.round(normalBetween(0, adults.size() + .4, 2, 0.2));
            for (int j = 0; j < parents; j++) {
                boolean parent = j < parents;
                boolean paymentResponsibility = parent;
                boolean dropoffAuthorization = true;
                PickupAuthorization pickupAuthorization = (parent ? random() < 0.95 : random() < 0.8)
                        ? PickupAuthorization.AUTHORIZED
                        : PickupAuthorization.NOT_AUTHORIZED;
                people.updateNonParticipantRelationship(
                        entity.getId(),
                        adults.get(j),
                        new NonParticipantRelationship(
                                dropoffAuthorization,
                                pickupAuthorization,
                                paymentResponsibility,
                                parent,
                                "test notes"));
            }
        }
    }

    private Family familyForNewParticipant() {
        Optional<Family> family = Optional.empty();
        if (random() < 0.5) {
            family = randomElement(people.findAllFamilies());
        }
        return family.orElseGet(() -> {
            String familyName = faker.name().lastName();
            Family _family = new Family(familyName);
            people.createFamily(_family);
            int nonParticipantsInFamily = (int) Math.round(normalBetween(1, 5, 2, 1));
            for (int i = 0; i < nonParticipantsInFamily; i++) {
                String last = random() < 0.6 ? familyName : faker.name().lastName();
                NonParticipant npp = new NonParticipant(faker.name().firstName(), last);
                people.createNonParticipant(npp);
                nonParticipantsByFamily.put(_family.getId(), npp.getId());
            }
            return _family;
        });
    }

    private SimulationParticipant generateParticipant(Family family) {
        SimulationParticipant p = new SimulationParticipant();
        p.firstName = faker.name().firstName();
        p.lastName = family.getName();
        p.dateOfBirth = LocalDate.now().minusYears(4).minusDays(Math.round(random() * 300));
        p.imgUrl = "baby1.jpg";

        // TODO age groups, vary rooms by age
        // TODO different hours by age (no all-day for school kids?)

        // Between 3-9h mean 7h
        long durationSeconds = roundToQuarter(normalBetween(3, 9, 7, 1) * SECONDS_IN_HOUR);
        if (random() < 0.7) {
            // Morning-anchored
            p.typicalStart = LocalTime.ofSecondOfDay(roundToQuarter(normalBetween(
                    OPENING_TIME.toSecondOfDay(),
                    OPENING_TIME.plusHours(2).toSecondOfDay(),
                    OPENING_TIME.plusHours(1).toSecondOfDay(),
                    SECONDS_IN_HOUR)));
            p.typicalEnd = p.typicalStart.plusSeconds(durationSeconds);
        } else {
            // Evening-anchored
            p.typicalEnd = LocalTime.ofSecondOfDay(roundToQuarter(normalBetween(
                    CLOSING_TIME.minusHours(2).toSecondOfDay(),
                    CLOSING_TIME.toSecondOfDay(),
                    CLOSING_TIME.minusHours(1).toSecondOfDay(),
                    SECONDS_IN_HOUR)));
            p.typicalStart = p.typicalEnd.minusSeconds(durationSeconds);
        }
        return p;
    }

    private String findRoom() {
        for (String roomId : roomOccupancy.keySet()) {
            if (roomOccupancy.get(roomId) < roomsById.get(roomId).getTargetCapacity()) {
                return roomId;
            }
        }
        for (String roomId : roomOccupancy.keySet()) {
            if (roomOccupancy.get(roomId) < roomsById.get(roomId).getMaxCapacity()) {
                return roomId;
            }
        }
        return ROOM_FLYING_SQUIRREL.getId();
    }

    private void generateParticipantTimelines(LocalDate date) {
        for (SimulationParticipant p : participants) {
            OffsetDateTime start = OffsetDateTime.of(date, p.typicalStart, NOW.getOffset());
            OffsetDateTime end = OffsetDateTime.of(date, p.typicalEnd, NOW.getOffset());
            scheduling.updateParticipantRoomAssignment(p.id, date, asList(new RoomAssignmentEntry(p.roomId, start,
                    end)));

            LocalTime arrivalTime = LocalTime.ofSecondOfDay((long) normalBetween(
                    OPENING_TIME.toSecondOfDay(),
                    p.typicalStart.plusHours(2).toSecondOfDay(),
                    p.typicalStart.toSecondOfDay(),
                    SECONDS_IN_HOUR / 2));
            OffsetDateTime arrival = OffsetDateTime.of(date, arrivalTime, NOW.getOffset());
            if (arrival.isBefore(NOW)) {
                scheduling.recordParticipantArrival(p.id, arrival, p.roomId);
            }

            LocalTime departureTime = LocalTime.ofSecondOfDay((long) normalBetween(
                    p.typicalEnd.minusHours(2).toSecondOfDay(),
                    CLOSING_TIME.toSecondOfDay(),
                    p.typicalEnd.toSecondOfDay(),
                    SECONDS_IN_HOUR / 2));
            OffsetDateTime departure = OffsetDateTime.of(date, departureTime, NOW.getOffset());
            if (departure.isBefore(NOW)) {
                scheduling.recordParticipantDeparture(p.id, departure);
            }
        }
    }

    private void generateStaffTimelines(LocalDate date) {
        List<Staff> staff = people.findAllStaff();
        Collections.shuffle(staff);
        Iterator<Staff> staffIterator = staff.iterator();
        for (Room room : rooms.findAll()) {
            int staffNeeded = (int) Math.ceil((double) roomOccupancy.get(room.getId()) / 8);
            for (int i = 0; i < staffNeeded; i++) {
                final LocalTime handoff = random() < .5 ? LocalTime.of(13, 0) : LocalTime.of(14, 0);
                generateStaffTimeline(staffIterator.next(), room, date, OPENING_TIME, handoff);
                generateStaffTimeline(staffIterator.next(), room, date, handoff, CLOSING_TIME);
            }
        }
    }

    private void generateStaffTimeline(Staff staff, Room room, LocalDate date, LocalTime start, LocalTime end) {
        OffsetDateTime startTime = OffsetDateTime.of(date, start, NOW.getOffset());
        OffsetDateTime endTime = OffsetDateTime.of(date, end, NOW.getOffset());
        scheduling.updateStaffRoomAssignment(staff.getId(), date, asList(new RoomAssignmentEntry(room, startTime,
                endTime)));

        OffsetDateTime arrival = OffsetDateTime.of(date, start, NOW.getOffset());
        if (arrival.isBefore(NOW)) {
            scheduling.recordStaffArrival(staff.getId(), arrival, room.getId());
        }

        OffsetDateTime departure = OffsetDateTime.of(date, end, NOW.getOffset());
        if (departure.isBefore(NOW)) {
            scheduling.recordStaffDeparture(staff.getId(), departure);
        }
    }


    private double normalBetween(double min, double max, double mean, double stdev) {
        while (true) {
            double value = random.nextGaussian() * stdev + mean;
            if (min <= value && value < max) {
                return value;
            }
        }
    }

    private long roundToQuarter(double seconds) {
        int secondsInQuarter = 60 * 15;
        return Math.round(seconds / secondsInQuarter) * secondsInQuarter;
    }

    private void generateUsers() {
        createUser("admin", "secret", Authorities.ADMIN, Authorities.SCHEDULE_MANAGE, Authorities.SCHEDULE_VIEW);
        createUser("jimmy", "jimmy", Authorities.SCHEDULE_MANAGE, Authorities.SCHEDULE_VIEW);
        createUser("jackie", "jackie", Authorities.SCHEDULE_VIEW);
    }

    private void createUser(String username, String password, String... authorities) {
        List<GrantedAuthority> gas = Stream.of(authorities).map(SimpleGrantedAuthority::new).collect(toList());
        userDetailsManager.createUser(new User(username, hashpw(password, gensalt()), gas));
    }

    private static class SimulationParticipant {
        String id;
        String firstName;
        String lastName;
        LocalDate dateOfBirth;
        String imgUrl;
        String roomId;
        LocalTime typicalStart;
        LocalTime typicalEnd;
    }
}

// Ratios from http://cfoc.nrckids.org/StandardView/1.1.1:
// ≤ 12 months    3:1   max 6/group
// < 3            4:1   max 8/group
// 3              7:1   max 14/group
// 4              8:1   max 17/group
// 5              8:1   max 17/group
// 6-8            10:1  max 20/group
// 9-12           12:1  max 24/group
