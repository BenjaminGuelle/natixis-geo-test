Feature: Region Search
  As a user
  I want to search for a French region
  So that I can see its departments and municipalities

  Scenario: Search for a region and see departments
    Given I am on the search page
    When I type "Normandie" in the search field
    And I select "Normandie" from the suggestions
    Then I should see the departments list
    And I should see "Calvados" in the departments list


  Scenario: Navigate to municipalities list
    Given I am on the search page
    When I type "Normandie" in the search field
    And I select "Normandie" from the suggestions
    And I click on department "14"
    Then I should be on the municipalities page for department "14"
    And I should see municipalities

  Scenario: Filter municipalities by name
    Given I am on the municipalities page for department "14"
    When I type "Caen" in the municipality filter
    Then I should see "Caen" in the municipalities list
    And I should not see "Ablon" in the municipalities list